<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Exigence;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CoursRequest;
use App\Http\Resources\CoursResource;
use App\Models\Cours;
use App\Models\Filiere;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CoursController extends Controller
{
    public function index(): Response
    {
        $cours = Cours::query()->with(['filiere', 'enseignant'])->avecStatistiques()->orderBy('code_ue')->get();

        return Inertia::render('admin/cours', [
            'cours' => $cours->map(fn (Cours $c): array => [
                ...(new CoursResource($c))->avecNotes()->resolve(),
                'filiere_id' => $c->filiere_id,
                'enseignant_id' => $c->enseignant_id,
            ]),
            'filieres' => Filiere::query()->withCount('cours')->orderBy('nom')->orderBy('niveau')->get()
                ->map(fn (Filiere $filiere): array => [
                    'id' => $filiere->id,
                    'nom' => $filiere->nom,
                    'niveau' => $filiere->niveau,
                    'libelle' => $filiere->libelle,
                    'nb_cours' => $filiere->cours_count,
                ]),
            'enseignants' => User::query()->enseignants()->orderBy('nom')->get()
                ->map(fn (User $enseignant): array => ['id' => $enseignant->id, 'nom_complet' => $enseignant->nom_complet]),
            'exigences' => collect(Exigence::cases())->map(fn (Exigence $exigence): array => ['value' => $exigence->value, 'label' => $exigence->label()]),
            'niveaux' => Filiere::NIVEAUX,
        ]);
    }

    public function store(CoursRequest $request): RedirectResponse
    {
        Cours::create($request->validated());

        $this->notifier('Cours créé.');

        return back();
    }

    public function update(CoursRequest $request, Cours $cours): RedirectResponse
    {
        $cours->fill($request->validated());
        $cours->touch();

        $this->notifier('Cours modifié.');

        return back();
    }

    public function destroy(Cours $cours): RedirectResponse
    {
        $cours->delete();

        $this->notifier('Cours supprimé, avec ses avis.');

        return back();
    }

    public function storeFiliere(Request $request): RedirectResponse
    {
        $donnees = $request->validate([
            'nom' => ['required', 'string', 'max:100'],
            'niveau' => ['required', Rule::in(Filiere::NIVEAUX), Rule::unique('filiere')->where('nom', $request->string('nom')->toString())],
        ]);

        Filiere::create($donnees);

        $this->notifier('Filière créée.');

        return back();
    }

    public function destroyFiliere(Filiere $filiere): RedirectResponse
    {
        if ($filiere->cours()->exists()) {
            $this->notifier('Impossible de supprimer une filière qui contient des cours.', 'error');

            return back();
        }

        $filiere->delete();

        $this->notifier('Filière supprimée.');

        return back();
    }
}
