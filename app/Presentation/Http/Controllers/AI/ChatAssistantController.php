<?php

namespace App\Presentation\Http\Controllers\AI;

use App\Application\AI\Services\ChatAssistantService;
use App\Http\Requests\AI\ChatAssistantRequest;
use App\Presentation\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ChatAssistantController extends Controller
{
    public function __construct(
        private ChatAssistantService $chatAssistantService
    ) {}

    public function __invoke(ChatAssistantRequest $request): JsonResponse
    {
        try {
            $data = $this->chatAssistantService->chat(
                $request->input('message'),
                $request->user()->id,
                $request->input('conversation_history')
            );

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process chat message: ' . $e->getMessage(),
            ], 500);
        }
    }
}

