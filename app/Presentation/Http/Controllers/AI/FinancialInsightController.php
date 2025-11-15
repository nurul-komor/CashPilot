<?php

namespace App\Presentation\Http\Controllers\AI;

use App\Application\AI\Services\FinancialInsightService;
use App\Presentation\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FinancialInsightController extends Controller
{
    public function __construct(
        private FinancialInsightService $financialInsightService
    ) {}

    public function insights(Request $request): JsonResponse
    {
        try {
            $period = $request->query('period', 'monthly');
            $data = $this->financialInsightService->generateInsights(
                $request->user()->id,
                $period
            );

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate insights: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function budgetRecommendations(Request $request): JsonResponse
    {
        try {
            $data = $this->financialInsightService->getBudgetRecommendations(
                $request->user()->id
            );

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate budget recommendations: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function summary(Request $request): JsonResponse
    {
        try {
            $period = $request->query('period', 'monthly');
            $data = $this->financialInsightService->generateSummary(
                $request->user()->id,
                $period
            );

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate summary: ' . $e->getMessage(),
            ], 500);
        }
    }
}

