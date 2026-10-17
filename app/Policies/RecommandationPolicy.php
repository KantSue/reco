<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RecommandationPolicy
{
    public function create(User $user, User $enseignant): Response
    {
        if ($user->role !== Role::Etudiant || $enseignant->role !== Role::Enseignant) {
            return Response::deny('Seuls les étudiants peuvent recommander un enseignant.');
        }

        return $enseignant->recommandationsRecues()->where('auteur_id', $user->id)->exists()
            ? Response::deny('Vous avez déjà recommandé cet enseignant.')
            : Response::allow();
    }
}
