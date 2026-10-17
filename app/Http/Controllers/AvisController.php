<?php

namespace App\Http\Controllers;

use App\Http\Requests\AvisRequest;
use App\Models\Avis;
use App\Models\Cours;
use App\Models\PeriodeEvaluation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class AvisController extends Controller
{
    public function store(AvisRequest $request, Cours $cours): RedirectResponse
    {
        Gate::authorize('deposerAvis', $cours);

        $periode = PeriodeEvaluation::enCours();

        if ($periode === null) {
            throw ValidationException::withMessages([
                'commentaire' => 'Les évaluations sont fermées : aucune période d\'évaluation n\'est ouverte.',
            ]);
        }

        $dejaDepose = Avis::query()
            ->where('auteur_id', $request->user()->id)
            ->where('cours_id', $cours->id)
            ->where('periode_id', $periode->id)
            ->exists();

        if ($dejaDepose) {
            throw ValidationException::withMessages([
                'commentaire' => 'Vous avez déjà donné votre avis sur ce cours pour cette période. Vous pouvez le modifier.',
            ]);
        }

        $avis = new Avis([...$request->validated(), 'cours_id' => $cours->id, 'periode_id' => $periode->id]);
        $avis->auteur_id = $request->user()->id;
        $avis->save();

        $this->notifier('Merci ! Votre avis est publié, sans votre nom.');

        return to_route('cours.show', $cours);
    }

    public function update(AvisRequest $request, Avis $avis): RedirectResponse
    {
        Gate::authorize('update', $avis);

        $avis->update($request->validated());

        $this->notifier('Votre avis a été modifié.');

        return to_route('cours.show', $avis->cours_id);
    }

    public function destroy(Avis $avis): RedirectResponse
    {
        Gate::authorize('delete', $avis);

        $avis->delete();

        $this->notifier('Votre avis a été supprimé.');

        return to_route('cours.show', $avis->cours_id);
    }
}
