<?php

namespace App\Presentation\Http\Controllers\AI;

use App\Application\AI\Services\AccountDocumentOCRService;
use App\Presentation\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountDocumentOCRController extends Controller
{
    public function __construct(
        private AccountDocumentOCRService $accountDocumentOCRService
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'document' => 'required|file|image|max:10240|mimes:jpeg,jpg,png,webp',
            ]);

            $file = $request->file('document');
            $path = $file->store('account-documents', 'public');

            $data = $this->accountDocumentOCRService->extractAccountData($path, $request->user()->id);

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process document: ' . $e->getMessage(),
            ], 500);
        }
    }
}

