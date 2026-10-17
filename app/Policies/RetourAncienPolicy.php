<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\RetourAncien;
use App\Models\User;

class RetourAncienPolicy
{
    /**
     * F15 et règle 9 : seuls les anciens étudiants publient des retours d'expérience.
     */
    public function create(User $user): bool
    {
        return $user->role === Role::Ancien;
    }

    public function delete(User $user, RetourAncien $retour): bool
    {
        return $retour->auteur_id === $user->id || $user->role === Role::Admin;
    }
}
