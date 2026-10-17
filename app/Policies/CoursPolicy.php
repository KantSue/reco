<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\Cours;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CoursPolicy
{
    /**
     * NF2 et règle 6 : les avis sont visibles par les étudiants, l'administration
     * et l'enseignant du cours. Visiteurs et anciens ne voient que la fiche officielle.
     */
    public function voirAvis(?User $user, Cours $cours): bool
    {
        if ($user === null) {
            return false;
        }

        return $user->hasRole(Role::Etudiant, Role::Admin)
            || ($user->role === Role::Enseignant && $cours->enseignant_id === $user->id);
    }

    /**
     * Règles 1 et 9 : seul un étudiant inscrit au cours peut déposer un avis.
     */
    public function deposerAvis(User $user, Cours $cours): Response
    {
        if ($user->role !== Role::Etudiant) {
            return Response::deny('Seuls les étudiants inscrits peuvent déposer un avis noté.');
        }

        return $user->suitLeCours($cours)
            ? Response::allow()
            : Response::deny('Vous ne suivez pas ce cours.');
    }

    /**
     * F7 : l'enseignant met à jour la fiche de ses cours, l'administration toutes les fiches.
     */
    public function update(User $user, Cours $cours): bool
    {
        return $user->role === Role::Admin
            || ($user->role === Role::Enseignant && $cours->enseignant_id === $user->id);
    }
}
