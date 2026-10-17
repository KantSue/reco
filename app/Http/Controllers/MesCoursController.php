<?php

namespace App\Http\Controllers;

use App\Enums\Exigence;
use App\Http\Requests\FicheCoursRequest;
use App\Http\Resources\AvisResource;
use App\Http\Resources\CoursResource;
use App\Models\Cours;
use App\Models\Signalement;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MesCoursController extends Controller
{
    public function index(Request $request): Response
    {
        $enseignant = $request->user();

        $mesCours = $enseignant->coursAssures()
            ->with('filiere')
            ->avecStatistiques()
            ->withCount(['avis as nb_sans_reponse' => fn (Builder $avis) => $avis->publies()->whereDoesntHave('reponse')])
            ->orderBy('intitule')
            ->get();

        $coursSelectionne = $mesCours->firstWhere('id', $request->integer('cours')) ?? $mesCours->first();

        $avis = $coursSelectionne
            ? $coursSelectionne->avis()->publies()->with(['reponse.enseignant', 'periode'])->latest('date_creation')->get()
            : collect();

        return Inertia::render('mes-cours', [
            'mesCours' => $mesCours->map(fn (Cours $cours): array => [
                ...(new CoursResource($cours))->avecNotes()->resolve(),
                'nb_sans_reponse' => (int) $cours->nb_sans_reponse,
            ]),
            'coursSelectionne' => $coursSelectionne ? (new CoursResource($coursSelectionne))->avecNotes()->resolve() : null,
            'avis' => AvisResource::collection($avis)->resolve(),
            'avisSignales' => Signalement::query()
                ->where('utilisateur_id', $enseignant->id)
                ->whereIn('avis_id', $avis->pluck('id'))
                ->pluck('avis_id'),
            'exigences' => collect(Exigence::cases())->map(fn (Exigence $exigence): array => [
                'value' => $exigence->value,
                'label' => $exigence->label(),
            ]),
        ]);
    }

    public function update(FicheCoursRequest $request, Cours $cours): RedirectResponse
    {
        $cours->fill($request->validated());
        $cours->touch();

        $this->notifier('Fiche enregistrée. La date de mise à jour a été renouvelée.');

        return to_route('mes-cours.index', ['cours' => $cours->id]);
    }
}
