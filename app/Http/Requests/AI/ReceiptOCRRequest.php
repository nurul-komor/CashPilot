<?php

namespace App\Http\Requests\AI;

use Illuminate\Foundation\Http\FormRequest;

class ReceiptOCRRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'receipt' => 'required|file|image|max:10240|mimes:jpeg,jpg,png,webp',
        ];
    }
}

