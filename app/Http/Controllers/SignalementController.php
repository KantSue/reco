<?php

namespace App\Http\Controllers;

use App\Models\Avis;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SignalementController extends Controller
{
    /**
     * F10 et règle 5 : signaler un avis inapproprié (masqué au 3e signalement).
     */
    public function store(Request $request, Avis $avis): RedirectResponse
    {
        Gate::authorize('signaler', $avis);

        $donnees = $request->validate([
            'motif' => ['nullable', 'string', 'max:255'],
        ]);

        $avis->signaler($request->user(), $donnees['motif'] ?? null);

        $this->notifier("Merci, l'avis a été signalé à l'administration.");

        return back();
    }
}
