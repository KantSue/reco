<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * NF6 : formulaire court (note et commentaire).
 */
class AvisRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'note' => ['required', 'integer', 'between:1,5'],
            'commentaire' => ['required', 'string', 'min:10', 'max:1000'],
        ];
    }
}
