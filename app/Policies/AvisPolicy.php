<?php

namespace App\Policies;

use App\Enums\Role;
use App\Enums\StatutAvis;
use App\Models\Avis;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AvisPolicy
{
    public function update(User $user, Avis $avis): bool
    {
        return $avis->estDeLAuteur($user) && $avis->statut === StatutAvis::Publie;
    }

    public function delete(User $user, Avis $avis): bool
    {
        return $avis->estDeLAuteur($user) || $user->role === Role::Admin;
    }

    public function signaler(User $user, Avis $avis): Response
    {
        $peutSignaler = $user->role === Role::Etudiant
            || ($user->role === Role::Enseignant && $avis->cours->enseignant_id === $user->id);

        if (! $peutSignaler || $avis->estDeLAuteur($user) || $avis->statut !== StatutAvis::Publie) {
            return Response::deny('Vous ne pouvez pas signaler cet avis.');
        }

        return $avis->signalements()->where('utilisateur_id', $user->id)->exists()
            ? Response::deny('Vous avez déjà signalé cet avis.')
            : Response::allow();
    }

    public function repondre(User $user, Avis $avis): Response
    {
        if ($user->role !== Role::Enseignant || $avis->cours->enseignant_id !== $user->id) {
            return Response::deny("Vous ne pouvez répondre qu'aux avis sur vos cours.");
        }

        return $avis->reponse()->exists()
            ? Response::deny('Vous avez déjà répondu à cet avis.')
            : Response::allow();
    }

    public function moderer(User $user, Avis $avis): bool
    {
        return $user->role === Role::Admin;
    }
}
