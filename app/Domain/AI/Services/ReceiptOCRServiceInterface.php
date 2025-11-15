<?php

namespace App\Domain\AI\Services;

interface ReceiptOCRServiceInterface
{
    /**
     * Extract transaction data from receipt image
     *
     * @param string $imagePath Path to the receipt image file
     * @param int $userId User ID for context-aware suggestions
     * @return array Structured transaction data with merchant, amount, date, items, suggested category, tags, etc.
     */
    public function extractTransactionData(string $imagePath, int $userId): array;
}

