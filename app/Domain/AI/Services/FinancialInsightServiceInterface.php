<?php

namespace App\Domain\AI\Services;

interface FinancialInsightServiceInterface
{
    /**
     * Generate financial insights and recommendations
     *
     * @param int $userId User ID
     * @param string|null $period Period for analysis (monthly, weekly, yearly)
     * @return array Insights, recommendations, trends, and suggestions
     */
    public function generateInsights(int $userId, ?string $period = 'monthly'): array;

    /**
     * Get personalized budget recommendations
     *
     * @param int $userId User ID
     * @return array Budget recommendations by category
     */
    public function getBudgetRecommendations(int $userId): array;

    /**
     * Generate financial summary
     *
     * @param int $userId User ID
     * @param string $period Period for summary
     * @return array Summary with income, expenses, savings, trends
     */
    public function generateSummary(int $userId, string $period = 'monthly'): array;
}

