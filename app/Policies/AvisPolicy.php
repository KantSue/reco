<?php

namespace App\Policies;

use App\Enums\Role;
use App\Enums\StatutAvis;
use App\Models\Avis;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AvisPolicy
{
    /**
     * NF5 : l'avis est modifiable par son auteur tant qu'il est publié.
     */
    public function update(User $user, Avis $avis): bool
    {
        return $avis->estDeLAuteur($user) && $avis->statut === StatutAvis::Publie;
    }

    /**
     * L'auteur peut retirer son avis ; l'administration peut le supprimer.
     */
    public function delete(User $user, Avis $avis): bool
    {
        return $avis->estDeLAuteur($user) || $user->role === Role::Admin;
    }

    /**
     * F10 : un étudiant ou l'enseignant du cours signale un avis publié, une seule fois.
     */
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

    /**
     * F11 et règle 6 : l'enseignant répond une seule fois aux avis sur ses propres cours.
     */
    public function repondre(User $user, Avis $avis): Response
    {
        if ($user->role !== Role::Enseignant || $avis->cours->enseignant_id !== $user->id) {
            return Response::deny("Vous ne pouvez répondre qu'aux avis sur vos cours.");
        }

        return $avis->reponse()->exists()
            ? Response::deny('Vous avez déjà répondu à cet avis.')
            : Response::allow();
    }

    /**
     * F9 : modération par l'administration.
     */
    public function moderer(User $user, Avis $avis): bool
    {
        return $user->role === Role::Admin;
    }
}
