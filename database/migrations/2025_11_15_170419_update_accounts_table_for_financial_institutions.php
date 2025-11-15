<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add new financial_institution_id column if it doesn't exist
        if (!Schema::hasColumn('accounts', 'financial_institution_id')) {
            Schema::table('accounts', function (Blueprint $table) {
                $table->foreignId('financial_institution_id')->nullable()->after('type')->constrained('financial_institutions')->onDelete('set null');
            });
        }

        // Migrate existing bank_id to financial_institution_id
        if (Schema::hasColumn('accounts', 'bank_id')) {
            $accountsWithBanks = DB::table('accounts')
                ->whereNotNull('bank_id')
                ->get();

            foreach ($accountsWithBanks as $account) {
                // Find the bank first
                $bank = DB::table('banks')->where('id', $account->bank_id)->first();
                if ($bank) {
                    // Find the corresponding financial_institution by matching the bank name
                    $fi = DB::table('financial_institutions')
                        ->where('type', 'bank')
                        ->where('name', $bank->name)
                        ->first();

                    if ($fi) {
                        DB::table('accounts')
                            ->where('id', $account->id)
                            ->update(['financial_institution_id' => $fi->id]);
                    }
                }
            }
        }

        // Migrate existing mobile_banking_service_id to financial_institution_id
        if (Schema::hasColumn('accounts', 'mobile_banking_service_id')) {
            $accountsWithMobile = DB::table('accounts')
                ->whereNotNull('mobile_banking_service_id')
                ->get();

            foreach ($accountsWithMobile as $account) {
                $service = DB::table('mobile_banking_services')->where('id', $account->mobile_banking_service_id)->first();
                if ($service) {
                    $fi = DB::table('financial_institutions')
                        ->where('type', 'mobile_banking')
                        ->where('name', $service->name)
                        ->first();

                    if ($fi) {
                        DB::table('accounts')
                            ->where('id', $account->id)
                            ->update(['financial_institution_id' => $fi->id]);
                    }
                }
            }
        }

        // Drop old columns after migration
        // Check if foreign keys exist using raw query
        $foreignKeys = DB::select("
            SELECT CONSTRAINT_NAME
            FROM information_schema.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'accounts'
            AND CONSTRAINT_NAME LIKE 'accounts_%_foreign'
        ");

        $foreignKeyNames = array_column($foreignKeys, 'CONSTRAINT_NAME');

        Schema::table('accounts', function (Blueprint $table) use ($foreignKeyNames) {
            // Drop bank_id foreign key and column if exists
            if (Schema::hasColumn('accounts', 'bank_id')) {
                // Drop foreign key using column name
                try {
                    $table->dropForeign(['bank_id']);
                } catch (\Exception $e) {
                    // Foreign key might not exist, try with constraint name
                    $fkName = 'accounts_bank_id_foreign';
                    if (in_array($fkName, $foreignKeyNames)) {
                        try {
                            DB::statement("ALTER TABLE accounts DROP FOREIGN KEY {$fkName}");
                        } catch (\Exception $e2) {
                            // Ignore if it doesn't exist
                        }
                    }
                }
                try {
                    $table->dropColumn('bank_id');
                } catch (\Exception $e) {
                    // Column might not exist, continue
                }
            }

            // Drop mobile_banking_service_id foreign key and column if exists
            if (Schema::hasColumn('accounts', 'mobile_banking_service_id')) {
                // Check if foreign key exists before trying to drop it
                $fkName = 'accounts_mobile_banking_service_id_foreign';
                if (in_array($fkName, $foreignKeyNames)) {
                    try {
                        DB::statement("ALTER TABLE accounts DROP FOREIGN KEY {$fkName}");
                    } catch (\Exception $e) {
                        // Ignore if it doesn't exist
                    }
                }
                // Drop column (foreign key might not exist, which is fine)
                try {
                    $table->dropColumn('mobile_banking_service_id');
                } catch (\Exception $e) {
                    // Column might not exist, continue
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->foreignId('bank_id')->nullable()->after('type')->constrained()->onDelete('set null');
            $table->foreignId('mobile_banking_service_id')->nullable()->after('bank_id')->constrained()->onDelete('set null');
        });

        // Note: Reverse migration would need to map financial_institution_id back to bank_id or mobile_banking_service_id
        // This is complex and may not be fully reversible

        Schema::table('accounts', function (Blueprint $table) {
            $table->dropForeign(['financial_institution_id']);
            $table->dropColumn('financial_institution_id');
        });
    }
};
