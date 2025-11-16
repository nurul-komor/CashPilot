<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFinancialRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'currency' => ['required', 'string', 'max:3'],
            'date_format' => ['required', 'string', 'max:20'],
            'number_format' => ['required', 'string', 'max:20'],
            'timezone' => ['required', 'string', 'max:255'],
            'tax_id' => ['nullable', 'string', 'max:255'],
        ];
    }
}


