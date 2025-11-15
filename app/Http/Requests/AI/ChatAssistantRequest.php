<?php

namespace App\Http\Requests\AI;

use Illuminate\Foundation\Http\FormRequest;

class ChatAssistantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'message' => 'required|string|max:2000',
            'conversation_history' => 'nullable|array',
            'conversation_history.*.user' => 'required_with:conversation_history|string',
            'conversation_history.*.assistant' => 'required_with:conversation_history|string',
        ];
    }
}

