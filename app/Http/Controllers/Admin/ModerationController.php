<?php

namespace App\Http\Controllers\Admin;

use App\Enums\StatutAvis;
use App\Http\Controllers\Controller;
use App\Http\Resources\AvisResource;
use App\Models\Avis;
use App\Models\Cours;
use App\Models\PeriodeEvaluation;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ModerationController extends Controller
{
    public function index(): Response
    {
        $aTraiter = Avis::query()
            ->where(fn (Builder $query) => $query
                ->where('statut', StatutAvis::Signale)
                ->orWhere(fn (Builder $q) => $q->where('statut', StatutAvis::Publie)->where('nb_signalements', '>', 0)))
            ->with(['cours', 'signalements'])
            ->orderByDesc('nb_signalements')
            ->latest('date_creation')
            ->get();

        $masques = Avis::query()
            ->where('statut', StatutAvis::Masque)
            ->with(['cours', 'signalements'])
            ->latest('date_creation')
            ->get();

        $periode = PeriodeEvaluation::enCours();

        return Inertia::render('admin/moderation', [
            'aTraiter' => AvisResource::collection($aTraiter)->resolve(),
            'masques' => AvisResource::collection($masques)->resolve(),
            'compteurs' => [
                'a_traiter' => $aTraiter->count(),
                'masques_automatiquement' => $aTraiter->where('statut', StatutAvis::Signale)->count(),
                'fiches_perimees' => Cours::query()->perimes()->count(),
            ],
            'periode' => $periode ? [
                'libelle' => $periode->libelle,
                'date_fin' => $periode->date_fin->toDateString(),
            ] : null,
        ]);
    }

    public function update(Request $request, Avis $avis): RedirectResponse
    {
        Gate::authorize('moderer', $avis);

        $donnees = $request->validate([
            'statut' => ['required', Rule::in([StatutAvis::Publie->value, StatutAvis::Masque->value])],
        ]);

        $statut = StatutAvis::from($donnees['statut']);
        $avis->moderer($statut);

        $this->notifier($statut === StatutAvis::Publie ? 'Avis validé et republié.' : 'Avis masqué.');

        return back();
    }

    public function destroy(Avis $avis): RedirectResponse
    {
        Gate::authorize('delete', $avis);

        $avis->delete();

        $this->notifier('Avis supprimé définitivement.');

        return back();
    }
}
