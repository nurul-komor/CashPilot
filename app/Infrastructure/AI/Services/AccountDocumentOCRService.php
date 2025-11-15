<?php

namespace App\Infrastructure\AI\Services;

use App\Domain\AI\Services\AccountDocumentOCRServiceInterface;
use App\Domain\Bank\Repositories\FinancialInstitutionRepositoryInterface;
use App\Infrastructure\AI\GeminiClient;
use Illuminate\Support\Facades\Storage;

class AccountDocumentOCRService implements AccountDocumentOCRServiceInterface
{
    public function __construct(
        private GeminiClient $geminiClient,
        private FinancialInstitutionRepositoryInterface $financialInstitutionRepository
    ) {}

    public function extractAccountData(string $imagePath, int $userId): array
    {
        // Get available financial institutions for matching
        $institutions = $this->financialInstitutionRepository->findAllActive();
        $institutionList = $institutions->map(fn($inst) => "{$inst->id}: {$inst->name} ({$inst->type})")->join(', ');

        $prompt = "Analyze this account document image (bank statement, card, passbook, or account screenshot) and extract the following information in JSON format:
{
  \"account_name\": \"suggested account name\",
  \"account_type\": \"cash\", \"bank\", \"credit_card\", \"debit_card\", \"mobile_banking\", \"savings\", \"investment\", or \"other\",
  \"financial_institution_id\": institution ID from this list: {$institutionList} (or null if not found),
  \"account_number\": \"account number if visible\",
  \"balance\": current balance as number (or null if not visible),
  \"currency\": \"BDT\", \"USD\", or \"EUR\" (default to BDT if not clear),
  \"notes\": \"any additional relevant information extracted\"
}

Be smart about identifying:
- Bank names and matching them to the institution list
- Account types based on document type (statement = bank, card image = credit_card/debit_card, etc.)
- Account numbers, balances, and other details
- If you cannot determine a value, use null.";

        // Handle different path formats
        if (str_starts_with($imagePath, 'account-documents/')) {
            $fullImagePath = Storage::disk('public')->path($imagePath);
        } elseif (file_exists($imagePath)) {
            $fullImagePath = $imagePath;
        } else {
            $fullImagePath = storage_path('app/public/' . $imagePath);
        }

        if (!file_exists($fullImagePath)) {
            throw new \Exception("Account document image not found: {$imagePath}");
        }

        $response = $this->geminiClient->analyzeImage($fullImagePath, $prompt, [
            'temperature' => 0.3, // Lower temperature for more accurate extraction
        ]);

        $data = $this->parseJsonResponse($response);

        // Validate and format the response
        return [
            'name' => $data['account_name'] ?? null,
            'type' => $this->validateAccountType($data['account_type'] ?? 'other'),
            'financial_institution_id' => isset($data['financial_institution_id']) && $data['financial_institution_id'] !== null
                ? (int) $data['financial_institution_id']
                : null,
            'account_number' => $data['account_number'] ?? null,
            'balance' => isset($data['balance']) ? (string) $data['balance'] : '0',
            'currency' => $data['currency'] ?? 'BDT',
            'notes' => $data['notes'] ?? null,
        ];
    }

    private function validateAccountType(?string $type): string
    {
        $validTypes = ['cash', 'bank', 'credit_card', 'debit_card', 'mobile_banking', 'savings', 'investment', 'other'];
        return in_array($type, $validTypes) ? $type : 'other';
    }

    private function parseJsonResponse(string $response): array
    {
        // Try to extract JSON from the response
        if (preg_match('/\{.*\}/s', $response, $matches)) {
            $json = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return $json;
            }
        }

        // Try parsing the entire response
        $json = json_decode($response, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return $json;
        }

        // Fallback: return empty structure
        return [];
    }
}

