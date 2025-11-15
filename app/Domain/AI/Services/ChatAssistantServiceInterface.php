<?php

namespace App\Domain\AI\Services;

interface ChatAssistantServiceInterface
{
    /**
     * Process chat message and generate response
     *
     * @param string $message User's message/question
     * @param int $userId User ID for context
     * @param array|null $conversationHistory Previous messages in the conversation
     * @return array Response with 'message' and optional 'suggestions'
     */
    public function chat(string $message, int $userId, ?array $conversationHistory = null): array;
}

