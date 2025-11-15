<?php

namespace App\Presentation\Http\Controllers\AI;

use App\Application\AI\Services\DescriptionEnhancementService;
use App\Http\Requests\AI\DescriptionEnhancementRequest;
use App\Presentation\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class DescriptionEnhancementController extends Controller
{
    public function __construct(
        private DescriptionEnhancementService $descriptionEnhancementService
    ) {}

    public function __invoke(DescriptionEnhancementRequest $request): JsonResponse
    {
        try {
            $data = $this->descriptionEnhancementService->enhanceDescription(
                $request->input('description'),
                $request->input('context', [])
            );

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to enhance description: ' . $e->getMessage(),
            ], 500);
        }
    }
}

