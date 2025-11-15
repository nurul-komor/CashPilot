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
        // Migrate banks to financial_institutions
        if (Schema::hasTable('banks')) {
            $banks = DB::table('banks')->get();
            foreach ($banks as $bank) {
                DB::table('financial_institutions')->insert([
                    'name' => $bank->name,
                    'type' => 'bank',
                    'code' => $bank->code,
                    'country' => $bank->country ?? 'BD',
                    'logo' => $bank->logo,
                    'is_active' => $bank->is_active ?? true,
                    'created_at' => $bank->created_at,
                    'updated_at' => $bank->updated_at,
                ]);
            }
        }

        // Migrate mobile_banking_services to financial_institutions
        if (Schema::hasTable('mobile_banking_services')) {
            $services = DB::table('mobile_banking_services')->get();
            foreach ($services as $service) {
                DB::table('financial_institutions')->insert([
                    'name' => $service->name,
                    'type' => 'mobile_banking',
                    'code' => null,
                    'country' => 'BD',
                    'logo' => $service->logo,
                    'is_active' => $service->is_active ?? true,
                    'created_at' => $service->created_at,
                    'updated_at' => $service->updated_at,
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration is one-way. Data would need to be manually restored if needed.
    }
};
