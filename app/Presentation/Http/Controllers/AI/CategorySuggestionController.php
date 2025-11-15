<?php

namespace App\Presentation\Http\Controllers\AI;

use App\Application\AI\Services\CategorySuggestionService;
use App\Http\Requests\AI\CategorySuggestionRequest;
use App\Presentation\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class CategorySuggestionController extends Controller
{
    public function __construct(
        private CategorySuggestionService $categorySuggestionService
    ) {}

    public function __invoke(CategorySuggestionRequest $request): JsonResponse
    {
        try {
            $data = $this->categorySuggestionService->suggestCategoryAndTags(
                $request->input('description'),
                $request->user()->id,
                $request->input('amount')
            );

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate suggestions: ' . $e->getMessage(),
            ], 500);
        }
    }
}

