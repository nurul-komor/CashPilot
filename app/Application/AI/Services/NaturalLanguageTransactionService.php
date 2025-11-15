<?php

namespace App\Application\AI\Services;

use App\Domain\AI\Services\NaturalLanguageTransactionServiceInterface;

class NaturalLanguageTransactionService
{
    public function __construct(
        private NaturalLanguageTransactionServiceInterface $naturalLanguageTransactionService
    ) {}

    public function parseTransaction(string $input, int $userId): array
    {
        return $this->naturalLanguageTransactionService->parseTransaction($input, $userId);
    }
}

