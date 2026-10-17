<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        $this->configureAuthentication();
        $this->configureViews();
        $this->configureRateLimiting();
    }

    private function configureAuthentication(): void
    {
        Fortify::authenticateUsing(function (Request $request): ?User {
            $user = User::query()->where('identifiant', $request->string(Fortify::username())->trim()->toString())->first();

            if (! $user || ! Hash::check($request->string('password')->toString(), $user->mot_de_passe_hash)) {
                return null;
            }

            if (! $user->actif) {
                throw ValidationException::withMessages([
                    Fortify::username() => __('Ce compte est désactivé. Contactez la scolarité.'),
                ]);
            }

            return $user;
        });
    }

    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'status' => $request->session()->get('status'),
            'comptesDemo' => $this->app->isLocal() ? $this->comptesDemo() : [],
        ]));
    }

    /** @return list<array{role: string, identifiant: string, motDePasse: string}> */
    private function comptesDemo(): array
    {
        return array_map(fn (array $compte): array => [
            'role' => $compte[0],
            'identifiant' => $compte[1],
            'motDePasse' => 'Test1234',
        ], [
            ['Étudiant', 'ETU2026001'],
            ['Enseignant', 'h.rasoanaivo'],
            ['Ancien', 'ancien.andry'],
            ['Admin', 'admin'],
        ]);
    }

    private function configureRateLimiting(): void
    {
        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }
}
