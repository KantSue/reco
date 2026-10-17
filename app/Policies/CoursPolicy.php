<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\Cours;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CoursPolicy
{
    public function voirAvis(?User $user, Cours $cours): bool
    {
        if ($user === null) {
            return false;
        }

        return $user->hasRole(Role::Etudiant, Role::Admin)
            || ($user->role === Role::Enseignant && $cours->enseignant_id === $user->id);
    }

    public function deposerAvis(User $user, Cours $cours): Response
    {
        if ($user->role !== Role::Etudiant) {
            return Response::deny('Seuls les étudiants inscrits peuvent déposer un avis noté.');
        }

        return $user->suitLeCours($cours)
            ? Response::allow()
            : Response::deny('Vous ne suivez pas ce cours.');
    }

    public function update(User $user, Cours $cours): bool
    {
        return $user->role === Role::Admin
            || ($user->role === Role::Enseignant && $cours->enseignant_id === $user->id);
    }
}
