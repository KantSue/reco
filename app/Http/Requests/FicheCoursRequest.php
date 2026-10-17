<?php

namespace App\Http\Requests;

use App\Enums\Exigence;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Contenu pédagogique d'une fiche, modifiable par l'enseignant du cours (F7).
 */
class FicheCoursRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('cours')) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'contenu' => ['required', 'string', 'max:2000'],
            'chapitres' => ['required', 'string', 'max:3000'],
            'outils' => ['nullable', 'string', 'max:255'],
            'methode' => ['required', 'string', 'max:2000'],
            'evaluation' => ['nullable', 'string', 'max:1000'],
            'exigence' => ['required', Rule::enum(Exigence::class)],
        ];
    }
}
