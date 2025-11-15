<?php

namespace App\Application\AI\Services;

use App\Domain\AI\Services\AnomalyDetectionServiceInterface;

class AnomalyDetectionService
{
    public function __construct(
        private AnomalyDetectionServiceInterface $anomalyDetectionService
    ) {}

    public function detectAnomalies(int $userId, ?int $limit = 50): array
    {
        return $this->anomalyDetectionService->detectAnomalies($userId, $limit);
    }

    public function checkTransaction(array $transactionData, int $userId): ?array
    {
        return $this->anomalyDetectionService->checkTransaction($transactionData, $userId);
    }
}

