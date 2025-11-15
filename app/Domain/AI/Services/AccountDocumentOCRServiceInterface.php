<?php

namespace App\Domain\AI\Services;

interface AccountDocumentOCRServiceInterface
{
    /**
     * Extract account information from document image
     *
     * @param string $imagePath Path to the document image file
     * @param int $userId User ID for context
     * @return array Structured account data with name, type, institution, account_number, balance, etc.
     */
    public function extractAccountData(string $imagePath, int $userId): array;
}

