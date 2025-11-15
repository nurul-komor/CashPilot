<?php

namespace App\Domain\AI\Services;

interface NaturalLanguageTransactionServiceInterface
{
    /**
     * Parse natural language input and extract transaction data
     *
     * @param string $input Natural language input (e.g., "Spent $50 on groceries at Walmart")
     * @param int $userId User ID for account and category context
     * @return array Structured transaction data ready for creation
     */
    public function parseTransaction(string $input, int $userId): array;
}

