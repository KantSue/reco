<?php

namespace App\Http\Controllers;

use App\Models\Filiere;
use App\Models\RetourAncien;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RetourAncienController extends Controller
{
    /**
     * F15 : témoignages des anciens, filtrables par filière.
     */
    public function index(Request $request): Response
    {
        $filiere = $request->string('filiere')->toString();

        $retours = RetourAncien::query()
            ->with(['auteur', 'filiere'])
            ->when($filiere !== '', fn ($query) => $query->whereHas('filiere', fn ($f) => $f->where('nom', $filiere)))
            ->latest('date_creation')
            ->get();

        $user = $request->user();

        return Inertia::render('retours-anciens', [
            'retours' => $retours->map(fn (RetourAncien $retour): array => [
                'id' => $retour->id,
                'texte' => $retour->texte,
                'date' => $retour->date_creation->toIso8601String(),
                'filiere' => $retour->filiere->libelle,
                'annee_diplome' => $retour->auteur->annee_diplome,
                'peut_supprimer' => $user->can('delete', $retour),
            ]),
            'filiereActive' => $filiere,
            'filieres' => Filiere::query()->orderBy('nom')->distinct()->pluck('nom'),
            'filieresPublication' => Filiere::query()->orderBy('nom')->orderBy('niveau')->get()
                ->map(fn (Filiere $f): array => ['id' => $f->id, 'libelle' => $f->libelle]),
            'peutPublier' => $user->can('create', RetourAncien::class),
        ]);
    }

    /**
     * Règle 9 : un ancien publie un retour d'expérience (jamais d'avis noté).
     */
    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', RetourAncien::class);

        $donnees = $request->validate([
            'filiere_id' => ['required', 'integer', Rule::exists('filiere', 'id')],
            'texte' => ['required', 'string', 'min:20', 'max:2000'],
        ]);

        $retour = new RetourAncien($donnees);
        $retour->auteur_id = $request->user()->id;
        $retour->save();

        $this->notifier('Merci pour votre témoignage !');

        return to_route('retours-anciens.index');
    }

    public function destroy(RetourAncien $retour): RedirectResponse
    {
        Gate::authorize('delete', $retour);

        $retour->delete();

        $this->notifier('Le témoignage a été supprimé.');

        return back();
    }
}
