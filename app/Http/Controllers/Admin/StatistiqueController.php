<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Role;
use App\Enums\StatutAvis;
use App\Http\Controllers\Controller;
use App\Models\Avis;
use App\Models\Cours;
use App\Models\Recommandation;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class StatistiqueController extends Controller
{
    /**
     * F18 : tableau de bord des statistiques par cours.
     */
    public function index(): Response
    {
        $cours = Cours::query()
            ->with('filiere')
            ->avecStatistiques()
            ->withCount([
                'etudiants as nb_inscrits',
                'avis as nb_masques' => fn (Builder $avis) => $avis->whereIn('statut', [StatutAvis::Signale, StatutAvis::Masque]),
            ])
            ->orderBy('code_ue')
            ->get();

        return Inertia::render('admin/statistiques', [
            'totaux' => [
                'etudiants' => User::query()->where('role', Role::Etudiant)->count(),
                'avis' => Avis::query()->count(),
                'avis_publies' => Avis::query()->publies()->count(),
                'recommandations' => Recommandation::query()->count(),
            ],
            'cours' => $cours->map(fn (Cours $c): array => [
                'id' => $c->id,
                'code_ue' => $c->code_ue,
                'intitule' => $c->intitule,
                'filiere' => $c->filiere->libelle,
                'nb_inscrits' => (int) $c->nb_inscrits,
                'nb_avis' => (int) $c->nb_avis,
                'nb_masques' => (int) $c->nb_masques,
                'moyenne' => $c->moyenne_brute !== null ? round((float) $c->moyenne_brute, 1) : null,
                'participation' => $c->nb_inscrits > 0 ? (int) round(100 * $c->nb_avis / $c->nb_inscrits) : null,
                'est_perime' => $c->estPerime(),
                'date_maj' => $c->date_maj->toIso8601String(),
            ]),
        ]);
    }
}
