<?php

namespace App\Http\Requests\Admin;

use App\Enums\Exigence;
use App\Enums\Role;
use App\Models\Cours;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Création et modification d'un cours par l'administration (F8).
 */
class CoursRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Cours|null $cours */
        $cours = $this->route('cours');

        return [
            'code_ue' => ['required', 'string', 'max:20', Rule::unique('cours', 'code_ue')->ignore($cours?->id)],
            'intitule' => ['required', 'string', 'max:150'],
            'filiere_id' => ['required', 'integer', Rule::exists('filiere', 'id')],
            'enseignant_id' => ['nullable', 'integer', Rule::exists('utilisateur', 'id')->where('role', Role::Enseignant->value)],
            'semestre' => ['required', 'integer', 'between:1,10'],
            'contenu' => ['nullable', 'string', 'max:2000'],
            'chapitres' => ['nullable', 'string', 'max:3000'],
            'outils' => ['nullable', 'string', 'max:255'],
            'methode' => ['nullable', 'string', 'max:2000'],
            'evaluation' => ['nullable', 'string', 'max:1000'],
            'exigence' => ['required', Rule::enum(Exigence::class)],
        ];
    }
}
