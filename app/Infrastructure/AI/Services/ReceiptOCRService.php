<?php

namespace App\Infrastructure\AI\Services;

use App\Domain\AI\Services\ReceiptOCRServiceInterface;
use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use App\Domain\Tag\Repositories\TagRepositoryInterface;
use App\Domain\Transaction\Repositories\TransactionRepositoryInterface;
use App\Infrastructure\AI\GeminiClient;
use Illuminate\Support\Facades\Storage;

class ReceiptOCRService implements ReceiptOCRServiceInterface
{
    public function __construct(
        private GeminiClient $geminiClient,
        private CategoryRepositoryInterface $categoryRepository,
        private TagRepositoryInterface $tagRepository,
        private TransactionRepositoryInterface $transactionRepository
    ) {}

    public function extractTransactionData(string $imagePath, int $userId): array
    {
        // Get user's existing categories and tags for context
        $categories = $this->categoryRepository->findByUserId($userId);
        $tags = $this->tagRepository->findByUserId($userId);
        $recentTransactions = $this->transactionRepository->findByUserId($userId, [
            'start_date' => now()->subDays(30)->format('Y-m-d'),
        ])->take(10);

        $categoryList = $categories->map(fn($cat) => "{$cat->id}: {$cat->name} ({$cat->type})")->join(', ');
        $tagList = $tags->map(fn($tag) => $tag->name)->join(', ');

        $prompt = "Analyze this receipt image and extract the following information in JSON format:
{
  \"merchant\": \"merchant name\",
  \"amount\": \"total amount as number\",
  \"currency\": \"currency code (BDT, USD, EUR)\",
  \"date\": \"transaction date in YYYY-MM-DD format\",
  \"items\": [\"list of purchased items\"],
  \"suggested_category_id\": category ID from this list: {$categoryList} (or null if none match),
  \"suggested_tags\": [\"tag names from this list: {$tagList}\"],
  \"description\": \"concise transaction description\",
  \"notes\": \"any additional relevant information\"
}

If you cannot determine a value, use null. Be precise with amounts and dates.";

        // Handle different path formats
        if (str_starts_with($imagePath, 'receipts/')) {
            $fullImagePath = Storage::disk('public')->path($imagePath);
        } elseif (file_exists($imagePath)) {
            $fullImagePath = $imagePath;
        } else {
            $fullImagePath = storage_path('app/public/' . $imagePath);
        }

        if (!file_exists($fullImagePath)) {
            throw new \Exception("Receipt image not found: {$imagePath}");
        }

        $response = $this->geminiClient->analyzeImage($fullImagePath, $prompt, [
            'temperature' => 0.3, // Lower temperature for more accurate extraction
        ]);

        $data = $this->parseJsonResponse($response);

        // Validate and format the response
        return [
            'merchant' => $data['merchant'] ?? null,
            'amount' => isset($data['amount']) ? (string) $data['amount'] : null,
            'currency' => $data['currency'] ?? 'BDT',
            'transaction_date' => $data['date'] ?? now()->format('Y-m-d'),
            'items' => $data['items'] ?? [],
            'category_id' => isset($data['suggested_category_id']) && $data['suggested_category_id'] !== null
                ? (int) $data['suggested_category_id']
                : null,
            'tags' => $data['suggested_tags'] ?? [],
            'description' => $data['description'] ?? $data['merchant'] ?? 'Receipt transaction',
            'notes' => $data['notes'] ?? null,
            'type' => 'expense', // Receipts are typically expenses
        ];
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

