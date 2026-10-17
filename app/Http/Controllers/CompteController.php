<?php

namespace App\Http\Controllers;

use App\Concerns\PasswordValidationRules;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompteController extends Controller
{
    use PasswordValidationRules;

    /**
     * Informations du compte et changement de mot de passe.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('compte', [
            'compte' => [
                'identifiant' => $user->identifiant,
                'nom_complet' => $user->nom_complet,
                'email' => $user->email,
                'role' => $user->role->label(),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $donnees = $request->validate([
            'current_password' => $this->currentPasswordRules(),
            'password' => $this->passwordRules(),
        ]);

        $request->user()->update(['mot_de_passe_hash' => $donnees['password']]);

        $this->notifier('Mot de passe modifié.');

        return back();
    }
}
