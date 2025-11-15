<?php

namespace App\Domain\AI\Services;

interface AnomalyDetectionServiceInterface
{
    /**
     * Detect anomalies in user's transactions
     *
     * @param int $userId User ID
     * @param int|null $limit Number of recent transactions to analyze
     * @return array Anomalies with type, transaction_id, reason, severity
     */
    public function detectAnomalies(int $userId, ?int $limit = 50): array;

    /**
     * Check if a specific transaction is anomalous
     *
     * @param array $transactionData Transaction data to check
     * @param int $userId User ID for pattern comparison
     * @return array|null Anomaly details or null if normal
     */
    public function checkTransaction(array $transactionData, int $userId): ?array;
}

