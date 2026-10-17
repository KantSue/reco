<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cours;
use App\Models\SuiteDonnee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SuiteDonneeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/suites', [
            'cours' => Cours::query()->avecStatistiques()->orderBy('code_ue')->get()->map(fn (Cours $cours): array => [
                'id' => $cours->id,
                'libelle' => "{$cours->code_ue} · {$cours->intitule}",
                'nb_avis' => (int) $cours->nb_avis,
            ]),
            'suites' => SuiteDonnee::query()->with('cours')->latest('date_creation')->get()->map(fn (SuiteDonnee $suite): array => [
                'id' => $suite->id,
                'texte' => $suite->texte,
                'date' => $suite->date_creation->toIso8601String(),
                'cours' => [
                    'id' => $suite->cours->id,
                    'libelle' => "{$suite->cours->code_ue} · {$suite->cours->intitule}",
                ],
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $donnees = $request->validate([
            'cours_id' => ['required', 'integer', Rule::exists('cours', 'id')],
            'texte' => ['required', 'string', 'min:10', 'max:1000'],
        ]);

        $suite = new SuiteDonnee($donnees);
        $suite->admin_id = $request->user()->id;
        $suite->save();

        $this->notifier('Suite donnée publiée sur la fiche du cours.');

        return back();
    }

    public function destroy(SuiteDonnee $suite): RedirectResponse
    {
        $suite->delete();

        $this->notifier('Suite donnée retirée.');

        return back();
    }
}
