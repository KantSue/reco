<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PeriodeEvaluation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PeriodeEvaluationController extends Controller
{
    public function index(): Response
    {
        $periodes = PeriodeEvaluation::query()->withCount('avis')->orderByDesc('date_debut')->get();

        return Inertia::render('admin/periodes', [
            'periodes' => $periodes->map(fn (PeriodeEvaluation $periode): array => [
                'id' => $periode->id,
                'libelle' => $periode->libelle,
                'date_debut' => $periode->date_debut->toDateString(),
                'date_fin' => $periode->date_fin->toDateString(),
                'etat' => match (true) {
                    $periode->estOuverte() => 'ouverte',
                    $periode->date_debut->isFuture() => 'programmee',
                    default => 'terminee',
                },
                'nb_avis' => $periode->avis_count,
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $donnees = $request->validate([
            'libelle' => ['required', 'string', 'max:100'],
            'date_debut' => ['required', 'date'],
            'date_fin' => ['required', 'date', 'after_or_equal:date_debut'],
        ]);

        PeriodeEvaluation::create($donnees);

        $this->notifier("Période d'évaluation enregistrée.");

        return back();
    }

    public function update(Request $request, PeriodeEvaluation $periode): RedirectResponse
    {
        $donnees = $request->validate([
            'libelle' => ['required', 'string', 'max:100'],
            'date_debut' => ['required', 'date'],
            'date_fin' => ['required', 'date', 'after_or_equal:date_debut'],
        ]);

        $periode->update($donnees);

        $this->notifier("Période d'évaluation modifiée.");

        return back();
    }

    public function destroy(PeriodeEvaluation $periode): RedirectResponse
    {
        if ($periode->avis()->exists()) {
            $this->notifier('Impossible de supprimer une période qui contient déjà des avis.', 'error');

            return back();
        }

        $periode->delete();

        $this->notifier('Période supprimée.');

        return back();
    }
}
