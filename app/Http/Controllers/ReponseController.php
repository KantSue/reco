<?php

namespace App\Http\Controllers;

use App\Models\Avis;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ReponseController extends Controller
{
    /**
     * F11 : droit de réponse de l'enseignant, une fois par avis.
     */
    public function store(Request $request, Avis $avis): RedirectResponse
    {
        Gate::authorize('repondre', $avis);

        $donnees = $request->validate([
            'texte' => ['required', 'string', 'min:5', 'max:1000'],
        ]);

        $avis->reponse()->create([
            'enseignant_id' => $request->user()->id,
            'texte' => $donnees['texte'],
        ]);

        $this->notifier('Votre réponse est publiée sous l\'avis.');

        return back();
    }
}
