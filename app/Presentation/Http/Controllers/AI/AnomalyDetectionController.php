<?php

namespace App\Presentation\Http\Controllers\AI;

use App\Application\AI\Services\AnomalyDetectionService;
use App\Presentation\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnomalyDetectionController extends Controller
{
    public function __construct(
        private AnomalyDetectionService $anomalyDetectionService
    ) {}

    public function detect(Request $request): JsonResponse
    {
        try {
            $limit = $request->query('limit', 50);
            $data = $this->anomalyDetectionService->detectAnomalies(
                $request->user()->id,
                (int) $limit
            );

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to detect anomalies: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function check(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'transaction_data' => 'required|array',
                'transaction_data.type' => 'required|string|in:income,expense,transfer',
                'transaction_data.amount' => 'required|numeric|min:0',
                'transaction_data.description' => 'nullable|string|max:500',
            ]);

            $anomaly = $this->anomalyDetectionService->checkTransaction(
                $request->input('transaction_data'),
                $request->user()->id
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'is_anomalous' => $anomaly !== null,
                    'anomaly' => $anomaly,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to check transaction: ' . $e->getMessage(),
            ], 500);
        }
    }
}

