<?php

namespace App\Http\Controllers;

use App\Models\Recommandation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class RecommandationController extends Controller
{
    /**
     * F13 : recommander un enseignant avec un commentaire (auteur caché).
     */
    public function store(Request $request, User $enseignant): RedirectResponse
    {
        Gate::authorize('create', [Recommandation::class, $enseignant]);

        $donnees = $request->validate([
            'commentaire' => ['required', 'string', 'min:10', 'max:1000'],
        ]);

        $recommandation = new Recommandation($donnees);
        $recommandation->enseignant_id = $enseignant->id;
        $recommandation->auteur_id = $request->user()->id;
        $recommandation->save();

        $this->notifier('Merci ! Votre recommandation est publiée, sans votre nom.');

        return to_route('enseignants.show', $enseignant);
    }
}
