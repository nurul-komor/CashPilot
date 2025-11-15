<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FinancialInstitutionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if data already exists
        if (DB::table('financial_institutions')->count() > 0) {
            $this->command->info('Financial institutions already seeded. Skipping...');
            return;
        }

        $banks = [
            // State-owned Commercial Banks
            ['name' => 'Sonali Bank Limited', 'code' => 'SBL', 'country' => 'BD'],
            ['name' => 'Janata Bank Limited', 'code' => 'JBL', 'country' => 'BD'],
            ['name' => 'Agrani Bank Limited', 'code' => 'ABL', 'country' => 'BD'],
            ['name' => 'Rupali Bank Limited', 'code' => 'RBL', 'country' => 'BD'],
            ['name' => 'Bangladesh Development Bank Limited', 'code' => 'BDBL', 'country' => 'BD'],
            ['name' => 'BASIC Bank Limited', 'code' => 'BASIC', 'country' => 'BD'],

            // Specialized Development Banks
            ['name' => 'Bangladesh Krishi Bank', 'code' => 'BKB', 'country' => 'BD'],
            ['name' => 'Rajshahi Krishi Unnayan Bank', 'code' => 'RAKUB', 'country' => 'BD'],
            ['name' => 'Probashi Kallyan Bank', 'code' => 'PKB', 'country' => 'BD'],

            // Private Commercial Banks
            ['name' => 'Islami Bank Bangladesh Limited', 'code' => 'IBBL', 'country' => 'BD'],
            ['name' => 'Dutch-Bangla Bank Limited', 'code' => 'DBBL', 'country' => 'BD'],
            ['name' => 'BRAC Bank Limited', 'code' => 'BRAC', 'country' => 'BD'],
            ['name' => 'Eastern Bank Limited', 'code' => 'EBL', 'country' => 'BD'],
            ['name' => 'United Commercial Bank Limited', 'code' => 'UCBL', 'country' => 'BD'],
            ['name' => 'Mutual Trust Bank Limited', 'code' => 'MTB', 'country' => 'BD'],
            ['name' => 'Prime Bank Limited', 'code' => 'PBL', 'country' => 'BD'],
            ['name' => 'Southeast Bank Limited', 'code' => 'SEBL', 'country' => 'BD'],
            ['name' => 'Dhaka Bank Limited', 'code' => 'DBL', 'country' => 'BD'],
            ['name' => 'Bank Asia Limited', 'code' => 'BAL', 'country' => 'BD'],
            ['name' => 'Mercantile Bank Limited', 'code' => 'MBL', 'country' => 'BD'],
            ['name' => 'Standard Bank Limited', 'code' => 'SBL', 'country' => 'BD'],
            ['name' => 'One Bank Limited', 'code' => 'OBL', 'country' => 'BD'],
            ['name' => 'Premier Bank Limited', 'code' => 'PBL', 'country' => 'BD'],
            ['name' => 'City Bank Limited', 'code' => 'CBL', 'country' => 'BD'],
            ['name' => 'IFIC Bank Limited', 'code' => 'IFIC', 'country' => 'BD'],
            ['name' => 'Social Islami Bank Limited', 'code' => 'SIBL', 'country' => 'BD'],
            ['name' => 'Al-Arafah Islami Bank Limited', 'code' => 'AAIBL', 'country' => 'BD'],
            ['name' => 'Union Bank Limited', 'code' => 'UBL', 'country' => 'BD'],
            ['name' => 'Modhumoti Bank Limited', 'code' => 'MBL', 'country' => 'BD'],
            ['name' => 'Meghna Bank Limited', 'code' => 'MGBL', 'country' => 'BD'],
            ['name' => 'Midland Bank Limited', 'code' => 'MBL', 'country' => 'BD'],
            ['name' => 'NRB Bank Limited', 'code' => 'NRB', 'country' => 'BD'],
            ['name' => 'NRB Commercial Bank Limited', 'code' => 'NRCBL', 'country' => 'BD'],
            ['name' => 'Shahjalal Islami Bank Limited', 'code' => 'SJIBL', 'country' => 'BD'],
            ['name' => 'South Bangla Agriculture & Commerce Bank Limited', 'code' => 'SBACBL', 'country' => 'BD'],
            ['name' => 'Trust Bank Limited', 'code' => 'TBL', 'country' => 'BD'],
            ['name' => 'First Security Islami Bank Limited', 'code' => 'FSIBL', 'country' => 'BD'],
            ['name' => 'Jamuna Bank Limited', 'code' => 'JBL', 'country' => 'BD'],
            ['name' => 'Exim Bank Limited', 'code' => 'EXIM', 'country' => 'BD'],
            ['name' => 'Padma Bank Limited', 'code' => 'PBL', 'country' => 'BD'],
            ['name' => 'Community Bank Bangladesh Limited', 'code' => 'CBBL', 'country' => 'BD'],
            ['name' => 'Bengal Commercial Bank Limited', 'code' => 'BCBL', 'country' => 'BD'],
            ['name' => 'Citizens Bank PLC', 'code' => 'CBP', 'country' => 'BD'],

            // Foreign Commercial Banks
            ['name' => 'Standard Chartered Bank', 'code' => 'SCB', 'country' => 'BD'],
            ['name' => 'HSBC Bangladesh', 'code' => 'HSBC', 'country' => 'BD'],
            ['name' => 'Commercial Bank of Ceylon', 'code' => 'CBC', 'country' => 'BD'],
            ['name' => 'State Bank of India', 'code' => 'SBI', 'country' => 'BD'],
            ['name' => 'Habib Bank Limited', 'code' => 'HBL', 'country' => 'BD'],
            ['name' => 'National Bank of Pakistan', 'code' => 'NBP', 'country' => 'BD'],
            ['name' => 'Woori Bank', 'code' => 'WB', 'country' => 'BD'],
            ['name' => 'Bank Alfalah Limited', 'code' => 'BAFL', 'country' => 'BD'],
        ];

        $mobileBankingServices = [
            ['name' => 'bKash', 'country' => 'BD'],
            ['name' => 'Nagad', 'country' => 'BD'],
            ['name' => 'Rocket', 'country' => 'BD'],
            ['name' => 'Upay', 'country' => 'BD'],
            ['name' => 'mCash', 'country' => 'BD'],
            ['name' => 'Tap', 'country' => 'BD'],
            ['name' => 'OK Wallet', 'country' => 'BD'],
            ['name' => 'TeleCash', 'country' => 'BD'],
            ['name' => 'SureCash', 'country' => 'BD'],
            ['name' => 'iPay', 'country' => 'BD'],
            ['name' => 'FirstPay', 'country' => 'BD'],
            ['name' => 'MyCash', 'country' => 'BD'],
        ];

        // Insert banks
        foreach ($banks as $bank) {
            DB::table('financial_institutions')->insert([
                'name' => $bank['name'],
                'type' => 'bank',
                'code' => $bank['code'] ?? null,
                'country' => $bank['country'] ?? 'BD',
                'logo' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Insert mobile banking services
        foreach ($mobileBankingServices as $service) {
            DB::table('financial_institutions')->insert([
                'name' => $service['name'],
                'type' => 'mobile_banking',
                'code' => null,
                'country' => $service['country'] ?? 'BD',
                'logo' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
