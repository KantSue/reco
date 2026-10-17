<?php

namespace App\Http\Middleware;

use App\Enums\Role;
use App\Enums\StatutAvis;
use App\Models\Avis;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * @var string
     */
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'identifiant' => $user->identifiant,
                    'nom_complet' => $user->nom_complet,
                    'role' => $user->role->value,
                    'role_label' => $user->role->label(),
                ] : null,
            ],
            'avisATraiter' => fn (): ?int => $user?->role === Role::Admin
                ? Avis::query()
                    ->where('statut', StatutAvis::Signale)
                    ->orWhere(fn ($query) => $query->where('statut', StatutAvis::Publie)->where('nb_signalements', '>', 0))
                    ->count()
                : null,
        ];
    }
}
