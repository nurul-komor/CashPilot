<?php

namespace App\Presentation\Http\Controllers\AI;

use App\Application\AI\Services\NaturalLanguageTransactionService;
use App\Http\Requests\AI\NaturalLanguageRequest;
use App\Presentation\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class NaturalLanguageController extends Controller
{
    public function __construct(
        private NaturalLanguageTransactionService $naturalLanguageTransactionService
    ) {}

    public function __invoke(NaturalLanguageRequest $request): JsonResponse
    {
        try {
            $data = $this->naturalLanguageTransactionService->parseTransaction(
                $request->input('input'),
                $request->user()->id
            );

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to parse transaction: ' . $e->getMessage(),
            ], 500);
        }
    }
}

