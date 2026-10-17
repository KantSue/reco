<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UtilisateurRequest;
use App\Models\Cours;
use App\Models\InscriptionCours;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class UtilisateurController extends Controller
{
    public function index(Request $request): Response
    {
        $filtres = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'role' => ['nullable', Rule::enum(Role::class)],
        ]);

        $annee = InscriptionCours::anneeUniversitaireCourante();

        $utilisateurs = User::query()
            ->when($filtres['q'] ?? null, fn (Builder $query, string $recherche) => $query->where(fn (Builder $q) => $q
                ->where('nom', 'like', "%{$recherche}%")
                ->orWhere('prenom', 'like', "%{$recherche}%")
                ->orWhere('identifiant', 'like', "%{$recherche}%")))
            ->when($filtres['role'] ?? null, fn (Builder $query, string $role) => $query->where('role', $role))
            ->with(['coursSuivis' => fn ($cours) => $cours->wherePivot('annee_universitaire', $annee)->select('cours.id')])
            ->orderBy('role')
            ->orderBy('nom')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (User $utilisateur): array => [
                'id' => $utilisateur->id,
                'identifiant' => $utilisateur->identifiant,
                'nom' => $utilisateur->nom,
                'prenom' => $utilisateur->prenom,
                'email' => $utilisateur->email,
                'role' => $utilisateur->role->value,
                'role_label' => $utilisateur->role->label(),
                'annee_diplome' => $utilisateur->annee_diplome,
                'actif' => $utilisateur->actif,
                'cours_suivis' => $utilisateur->coursSuivis->pluck('id'),
            ]);

        return Inertia::render('admin/comptes', [
            'utilisateurs' => $utilisateurs,
            'filtres' => ['q' => $filtres['q'] ?? '', 'role' => $filtres['role'] ?? ''],
            'roles' => collect(Role::cases())->map(fn (Role $role): array => ['value' => $role->value, 'label' => $role->label()]),
            'cours' => Cours::query()->orderBy('code_ue')->get(['id', 'code_ue', 'intitule']),
            'anneeUniversitaire' => $annee,
        ]);
    }

    public function store(UtilisateurRequest $request): RedirectResponse
    {
        User::create($request->donneesCompte());

        $this->notifier('Compte créé.');

        return back();
    }

    public function update(UtilisateurRequest $request, User $utilisateur): RedirectResponse
    {
        $donnees = $request->donneesCompte();

        if ($utilisateur->is($request->user()) && ($donnees['role'] !== Role::Admin->value || ! $donnees['actif'])) {
            throw ValidationException::withMessages([
                'role' => 'Vous ne pouvez pas retirer vos propres droits d\'administration.',
            ]);
        }

        $utilisateur->update($donnees);

        $this->notifier('Compte modifié.');

        return back();
    }

    public function inscriptions(Request $request, User $utilisateur): RedirectResponse
    {
        abort_unless($utilisateur->role === Role::Etudiant, 404);

        $donnees = $request->validate([
            'cours' => ['array'],
            'cours.*' => ['integer', Rule::exists('cours', 'id')],
        ]);

        $annee = InscriptionCours::anneeUniversitaireCourante();

        $utilisateur->coursSuivis()->wherePivot('annee_universitaire', $annee)->detach();
        $utilisateur->coursSuivis()->attach(
            collect($donnees['cours'] ?? [])->unique()->mapWithKeys(fn (int $id): array => [$id => ['annee_universitaire' => $annee]])->all(),
        );

        $this->notifier('Inscriptions mises à jour.');

        return back();
    }
}
