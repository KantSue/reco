<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Http\Resources\AvisResource;
use App\Http\Resources\CoursResource;
use App\Models\Avis;
use App\Models\Cours;
use App\Models\Filiere;
use App\Models\PeriodeEvaluation;
use App\Models\Signalement;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CoursController extends Controller
{
    /**
     * F4 et F16 : recherche par nom, code UE, enseignant, filière ou niveau ; tri par note.
     * F17 : accessible sans compte (fiches officielles, sans les notes).
     */
    public function index(Request $request): Response
    {
        $filtres = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'filiere' => ['nullable', 'string', 'max:100'],
            'niveau' => ['nullable', 'in:'.implode(',', Filiere::NIVEAUX)],
            'tri' => ['nullable', 'in:nom,note,recent'],
        ]);

        $avecNotes = $this->peutVoirLesNotes($request);
        $tri = $filtres['tri'] ?? 'nom';

        $cours = Cours::query()
            ->with(['filiere', 'enseignant'])
            ->avecStatistiques()
            ->when($filtres['q'] ?? null, function (Builder $query, string $recherche): void {
                $query->where(function (Builder $query) use ($recherche): void {
                    $query->where('intitule', 'like', "%{$recherche}%")
                        ->orWhere('code_ue', 'like', "%{$recherche}%")
                        ->orWhereHas('enseignant', fn (Builder $enseignant) => $enseignant
                            ->where('nom', 'like', "%{$recherche}%")
                            ->orWhere('prenom', 'like', "%{$recherche}%"));
                });
            })
            ->when($filtres['filiere'] ?? null, fn (Builder $query, string $filiere) => $query->whereHas('filiere', fn (Builder $f) => $f->where('nom', $filiere)))
            ->when($filtres['niveau'] ?? null, fn (Builder $query, string $niveau) => $query->whereHas('filiere', fn (Builder $f) => $f->where('niveau', $niveau)))
            ->when($tri === 'recent', fn (Builder $query) => $query->orderByDesc('date_maj'))
            ->orderBy('intitule')
            ->get();

        if ($tri === 'note' && $avecNotes) {
            $cours = $cours->sortByDesc(fn (Cours $c): float => $c->moyenneAffichable() ?? -1)->values();
        }

        return Inertia::render('cours/index', [
            'cours' => $cours->map(fn (Cours $c): array => (new CoursResource($c))->avecNotes($avecNotes)->resolve()),
            'filtres' => [
                'q' => $filtres['q'] ?? '',
                'filiere' => $filtres['filiere'] ?? '',
                'niveau' => $filtres['niveau'] ?? '',
                'tri' => $tri,
            ],
            'filieres' => Filiere::query()->orderBy('nom')->distinct()->pluck('nom'),
            'niveaux' => Filiere::NIVEAUX,
            'avecNotes' => $avecNotes,
        ]);
    }

    /**
     * F2, F3, F6 : fiche complète, avis anonymes, réponses et suite donnée.
     */
    public function show(Request $request, Cours $cours): Response
    {
        $user = $request->user();
        $cours->load(['filiere', 'enseignant']);
        $peutVoirAvis = $user?->can('voirAvis', $cours) ?? false;

        $cours->loadCount(['avis as nb_avis' => fn (Builder $avis) => $avis->publies()])
            ->loadAvg(['avis as moyenne_brute' => fn (Builder $avis) => $avis->publies()], 'note');

        $avis = $peutVoirAvis
            ? $cours->avis()->publies()->with(['reponse.enseignant', 'periode'])->latest('date_creation')->get()
            : collect();

        return Inertia::render('cours/show', [
            'cours' => (new CoursResource($cours))->avecNotes($peutVoirAvis)->resolve(),
            'peutVoirAvis' => $peutVoirAvis,
            'avis' => AvisResource::collection($avis)->resolve(),
            'repartition' => $peutVoirAvis && $cours->moyenneAffichable() !== null
                ? collect(range(5, 1))->mapWithKeys(fn (int $note): array => [$note => $avis->where('note', $note)->count()])
                : null,
            'avisSignales' => $user && $avis->isNotEmpty()
                ? Signalement::query()->where('utilisateur_id', $user->id)->whereIn('avis_id', $avis->pluck('id'))->pluck('avis_id')
                : [],
            'suites' => $cours->suitesDonnees()->latest('date_creation')->get()->map(fn ($suite): array => [
                'id' => $suite->id,
                'texte' => $suite->texte,
                'date' => $suite->date_creation->toIso8601String(),
            ]),
            'depot' => $user?->role === Role::Etudiant ? $this->etatDepot($user, $cours) : null,
        ]);
    }

    /**
     * Les notes sont dérivées des avis : réservées aux membres qui lisent les avis.
     */
    private function peutVoirLesNotes(Request $request): bool
    {
        return $request->user()?->hasRole(Role::Etudiant, Role::Enseignant, Role::Admin) ?? false;
    }

    /**
     * Diagramme d'activité « déposer un avis » : période ouverte, inscription, avis existant.
     *
     * @return array<string, mixed>
     */
    private function etatDepot(User $etudiant, Cours $cours): array
    {
        $periode = PeriodeEvaluation::enCours();
        $autorisation = $etudiant->can('deposerAvis', $cours);
        $monAvis = $periode
            ? Avis::query()->where('auteur_id', $etudiant->id)->where('cours_id', $cours->id)->where('periode_id', $periode->id)->first()
            : null;

        return [
            'periode' => $periode?->libelle,
            'periode_fin' => $periode?->date_fin->toDateString(),
            'suit_le_cours' => $autorisation,
            'possible' => $periode !== null && $autorisation,
            'mon_avis' => $monAvis ? [
                'id' => $monAvis->id,
                'note' => $monAvis->note,
                'commentaire' => $monAvis->commentaire,
                'statut' => $monAvis->statut->value,
            ] : null,
        ];
    }
}
