<?php

namespace App\Http\Requests\AI;

use Illuminate\Foundation\Http\FormRequest;

class CategorySuggestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'description' => 'required|string|max:500',
            'amount' => 'nullable|numeric|min:0',
        ];
    }
}

