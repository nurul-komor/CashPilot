<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('type'); // cash, bank, credit_card, debit_card, mobile_banking, savings, investment, other
            $table->foreignId('bank_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('mobile_banking_service_id')->nullable()->constrained()->onDelete('set null');
            $table->string('account_number')->nullable();
            $table->decimal('balance', 15, 2)->default(0);
            $table->string('currency')->default('BDT');
            $table->string('status')->default('active'); // active, inactive, archived
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
