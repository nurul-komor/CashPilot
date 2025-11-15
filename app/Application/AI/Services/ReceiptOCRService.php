<?php

namespace App\Application\AI\Services;

use App\Domain\AI\Services\ReceiptOCRServiceInterface;

class ReceiptOCRService
{
    public function __construct(
        private ReceiptOCRServiceInterface $receiptOCRService
    ) {}

    public function extractTransactionData(string $imagePath, int $userId): array
    {
        return $this->receiptOCRService->extractTransactionData($imagePath, $userId);
    }
}

