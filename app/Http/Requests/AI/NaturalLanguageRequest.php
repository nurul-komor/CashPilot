<?php

namespace App\Http\Requests\AI;

use Illuminate\Foundation\Http\FormRequest;

class NaturalLanguageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'input' => 'required|string|max:1000',
        ];
    }
}

