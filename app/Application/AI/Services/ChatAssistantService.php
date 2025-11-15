<?php

namespace App\Application\AI\Services;

use App\Domain\AI\Services\ChatAssistantServiceInterface;

class ChatAssistantService
{
    public function __construct(
        private ChatAssistantServiceInterface $chatAssistantService
    ) {}

    public function chat(string $message, int $userId, ?array $conversationHistory = null): array
    {
        return $this->chatAssistantService->chat($message, $userId, $conversationHistory);
    }
}

