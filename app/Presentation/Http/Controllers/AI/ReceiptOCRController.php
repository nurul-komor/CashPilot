<?php

namespace App\Presentation\Http\Controllers\AI;

use App\Application\AI\Services\ReceiptOCRService;
use App\Http\Requests\AI\ReceiptOCRRequest;
use App\Presentation\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ReceiptOCRController extends Controller
{
    public function __construct(
        private ReceiptOCRService $receiptOCRService
    ) {}

    public function __invoke(ReceiptOCRRequest $request): JsonResponse
    {
        try {
            $file = $request->file('receipt');
            $path = $file->store('receipts', 'public');

            $data = $this->receiptOCRService->extractTransactionData($path, $request->user()->id);

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process receipt: ' . $e->getMessage(),
            ], 500);
        }
    }
}

