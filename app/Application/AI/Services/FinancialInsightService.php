<?php

namespace App\Application\AI\Services;

use App\Domain\AI\Services\FinancialInsightServiceInterface;

class FinancialInsightService
{
    public function __construct(
        private FinancialInsightServiceInterface $financialInsightService
    ) {}

    public function generateInsights(int $userId, ?string $period = 'monthly'): array
    {
        return $this->financialInsightService->generateInsights($userId, $period);
    }

    public function getBudgetRecommendations(int $userId): array
    {
        return $this->financialInsightService->getBudgetRecommendations($userId);
    }

    public function generateSummary(int $userId, string $period = 'monthly'): array
    {
        return $this->financialInsightService->generateSummary($userId, $period);
    }
}

