<?php

namespace App\Application\AI\Services;

use App\Domain\AI\Services\AccountDocumentOCRServiceInterface;

class AccountDocumentOCRService
{
    public function __construct(
        private AccountDocumentOCRServiceInterface $accountDocumentOCRService
    ) {}

    public function extractAccountData(string $imagePath, int $userId): array
    {
        return $this->accountDocumentOCRService->extractAccountData($imagePath, $userId);
    }
}

