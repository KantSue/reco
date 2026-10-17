<?php

namespace App\Http\Requests\Admin;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UtilisateurRequest extends FormRequest
{
    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        /** @var User|null $utilisateur */
        $utilisateur = $this->route('utilisateur');

        return [
            'identifiant' => ['required', 'string', 'max:50', Rule::unique('utilisateur', 'identifiant')->ignore($utilisateur?->id)],
            'nom' => ['required', 'string', 'max:80'],
            'prenom' => ['required', 'string', 'max:80'],
            'email' => ['nullable', 'email', 'max:120', Rule::unique('utilisateur', 'email')->ignore($utilisateur?->id)],
            'role' => ['required', Rule::enum(Role::class)],
            'annee_diplome' => ['nullable', 'required_if:role,'.Role::Ancien->value, 'integer', 'between:1950,2100'],
            'actif' => ['required', 'boolean'],
            'mot_de_passe' => [$utilisateur ? 'nullable' : 'required', 'string', Password::min(8)],
        ];
    }

    /** @return array<string, mixed> */
    public function donneesCompte(): array
    {
        $donnees = $this->safe()->except('mot_de_passe');

        if ($this->filled('mot_de_passe')) {
            $donnees['mot_de_passe_hash'] = $this->string('mot_de_passe')->toString();
        }

        if ($donnees['role'] !== Role::Ancien->value) {
            $donnees['annee_diplome'] = null;
        }

        return $donnees;
    }
}
