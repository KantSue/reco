<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Http\Resources\CoursResource;
use App\Models\Cours;
use App\Models\Recommandation;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnseignantController extends Controller
{
    /**
     * Liste des enseignants avec leurs cours et le nombre de recommandations.
     */
    public function index(Request $request): Response
    {
        $recherche = $request->string('q')->trim()->toString();

        $enseignants = User::query()
            ->enseignants()
            ->where('actif', true)
            ->when($recherche !== '', fn (Builder $query) => $query->where(fn (Builder $q) => $q
                ->where('nom', 'like', "%{$recherche}%")
                ->orWhere('prenom', 'like', "%{$recherche}%")))
            ->withCount(['coursAssures', 'recommandationsRecues'])
            ->with(['coursAssures' => fn ($cours) => $cours->orderBy('intitule')->select(['id', 'code_ue', 'intitule', 'enseignant_id'])])
            ->orderBy('nom')
            ->get();

        return Inertia::render('enseignants/index', [
            'enseignants' => $enseignants->map(fn (User $enseignant): array => [
                'id' => $enseignant->id,
                'nom_complet' => $enseignant->nom_complet,
                'nb_cours' => $enseignant->cours_assures_count,
                'nb_recommandations' => $enseignant->recommandations_recues_count,
                'cours' => $enseignant->coursAssures->map(fn (Cours $cours): array => $cours->only(['id', 'code_ue', 'intitule'])),
            ]),
            'q' => $recherche,
        ]);
    }

    /**
     * Fiche enseignant : cours assurés et recommandations anonymes (F13).
     */
    public function show(Request $request, User $enseignant): Response
    {
        abort_unless($enseignant->role === Role::Enseignant, 404);

        $recommandations = $enseignant->recommandationsRecues()->latest('date_creation')->get();
        $user = $request->user();

        return Inertia::render('enseignants/show', [
            'enseignant' => [
                'id' => $enseignant->id,
                'nom_complet' => $enseignant->nom_complet,
                'initiale' => mb_substr($enseignant->nom, 0, 1),
            ],
            'cours' => $enseignant->coursAssures()->with('filiere')->orderBy('intitule')->get()
                ->map(fn (Cours $cours): array => (new CoursResource($cours))->resolve()),
            'recommandations' => $recommandations->map(fn (Recommandation $recommandation): array => [
                'id' => $recommandation->id,
                'commentaire' => $recommandation->commentaire,
                'date' => $recommandation->date_creation->toIso8601String(),
            ]),
            'peutRecommander' => $user->can('create', [Recommandation::class, $enseignant]),
            'dejaRecommande' => $recommandations->contains('auteur_id', $user->id),
        ]);
    }
}
