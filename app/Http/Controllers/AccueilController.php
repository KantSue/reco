<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Http\Resources\AvisResource;
use App\Http\Resources\CoursResource;
use App\Models\Avis;
use App\Models\Cours;
use App\Models\Filiere;
use App\Models\PeriodeEvaluation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccueilController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        return match ($user?->role) {
            null => redirect()->route('login'),
            Role::Enseignant => redirect()->route('mes-cours.index'),
            Role::Ancien => redirect()->route('retours-anciens.index'),
            Role::Admin => redirect()->route('admin.moderation.index'),
            Role::Etudiant => $this->accueilEtudiant($user),
        };
    }

    private function accueilEtudiant(User $etudiant): Response
    {
        $periode = PeriodeEvaluation::enCours();

        $coursEnAttente = $periode
            ? $etudiant->coursSuivis()
                ->whereDoesntHave('avis', fn ($avis) => $avis->where('auteur_id', $etudiant->id)->where('periode_id', $periode->id))
                ->orderBy('intitule')
                ->get(['cours.id', 'cours.code_ue', 'cours.intitule'])
                ->map(fn (Cours $cours): array => $cours->only(['id', 'code_ue', 'intitule']))
            : collect();

        $mieuxNotes = Cours::query()
            ->with(['filiere', 'enseignant'])
            ->avecStatistiques()
            ->get()
            ->filter(fn (Cours $cours): bool => $cours->moyenneAffichable() !== null)
            ->sortByDesc(fn (Cours $cours): float => (float) $cours->moyenneAffichable())
            ->take(3)
            ->map(fn (Cours $cours): array => (new CoursResource($cours))->avecNotes()->resolve())
            ->values();

        $derniersAvis = Avis::query()
            ->publies()
            ->with('cours')
            ->latest('date_creation')
            ->limit(4)
            ->get();

        return Inertia::render('accueil', [
            'periode' => $periode ? [
                'libelle' => $periode->libelle,
                'date_fin' => $periode->date_fin->toDateString(),
            ] : null,
            'coursEnAttente' => $coursEnAttente,
            'mieuxNotes' => $mieuxNotes,
            'derniersAvis' => AvisResource::collection($derniersAvis)->resolve(),
            'filieres' => Filiere::query()->orderBy('nom')->distinct()->pluck('nom'),
            'niveaux' => Filiere::NIVEAUX,
        ]);
    }
}
