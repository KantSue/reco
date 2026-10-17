<?php

use App\Http\Controllers\AccueilController;
use App\Http\Controllers\Admin;
use App\Http\Controllers\AvisController;
use App\Http\Controllers\CompteController;
use App\Http\Controllers\CoursController;
use App\Http\Controllers\EnseignantController;
use App\Http\Controllers\LivreController;
use App\Http\Controllers\MesCoursController;
use App\Http\Controllers\RecommandationController;
use App\Http\Controllers\ReponseController;
use App\Http\Controllers\RetourAncienController;
use App\Http\Controllers\SignalementController;
use Illuminate\Support\Facades\Route;

Route::get('/', AccueilController::class)->name('home');

// F17 : fiches officielles consultables sans compte (les avis restent réservés aux membres).
Route::get('cours', [CoursController::class, 'index'])->name('cours.index');
Route::get('cours/{cours}', [CoursController::class, 'show'])->name('cours.show');

Route::middleware('auth')->group(function () {
    Route::get('compte', [CompteController::class, 'edit'])->name('compte.edit');
    Route::put('compte/mot-de-passe', [CompteController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('compte.password.update');

    Route::middleware('role:etudiant')->group(function () {
        Route::post('cours/{cours}/avis', [AvisController::class, 'store'])->name('avis.store');
        Route::put('avis/{avis}', [AvisController::class, 'update'])->name('avis.update');
        Route::delete('avis/{avis}', [AvisController::class, 'destroy'])->name('avis.destroy');
        Route::post('enseignants/{enseignant}/recommandations', [RecommandationController::class, 'store'])->name('recommandations.store');
    });

    Route::post('avis/{avis}/signalements', [SignalementController::class, 'store'])
        ->middleware('role:etudiant,enseignant')
        ->name('signalements.store');

    Route::middleware('role:etudiant,admin')->group(function () {
        Route::get('enseignants', [EnseignantController::class, 'index'])->name('enseignants.index');
        Route::get('enseignants/{enseignant}', [EnseignantController::class, 'show'])->name('enseignants.show');
    });

    Route::middleware('role:etudiant,ancien,admin')->group(function () {
        Route::get('retours-anciens', [RetourAncienController::class, 'index'])->name('retours-anciens.index');
        Route::post('retours-anciens', [RetourAncienController::class, 'store'])->name('retours-anciens.store');
        Route::delete('retours-anciens/{retour}', [RetourAncienController::class, 'destroy'])->name('retours-anciens.destroy');
    });

    Route::middleware('role:enseignant')->group(function () {
        Route::get('mes-cours', [MesCoursController::class, 'index'])->name('mes-cours.index');
        Route::put('mes-cours/{cours}', [MesCoursController::class, 'update'])->name('mes-cours.update');
        Route::post('avis/{avis}/reponse', [ReponseController::class, 'store'])->name('reponses.store');
    });

    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::redirect('/', '/admin/moderation');

        Route::get('moderation', [Admin\ModerationController::class, 'index'])->name('moderation.index');
        Route::patch('avis/{avis}', [Admin\ModerationController::class, 'update'])->name('avis.update');
        Route::delete('avis/{avis}', [Admin\ModerationController::class, 'destroy'])->name('avis.destroy');

        Route::resource('periodes', Admin\PeriodeEvaluationController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['periodes' => 'periode']);

        Route::resource('suites', Admin\SuiteDonneeController::class)
            ->only(['index', 'store', 'destroy'])
            ->parameters(['suites' => 'suite']);

        Route::resource('comptes', Admin\UtilisateurController::class)
            ->only(['index', 'store', 'update'])
            ->parameters(['comptes' => 'utilisateur']);
        Route::put('comptes/{utilisateur}/inscriptions', [Admin\UtilisateurController::class, 'inscriptions'])->name('comptes.inscriptions');

        Route::resource('cours', Admin\CoursController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['cours' => 'cours']);
        Route::post('filieres', [Admin\CoursController::class, 'storeFiliere'])->name('filieres.store');
        Route::delete('filieres/{filiere}', [Admin\CoursController::class, 'destroyFiliere'])->name('filieres.destroy');

        Route::get('statistiques', [Admin\StatistiqueController::class, 'index'])->name('statistiques.index');
    });
});

Route::get('/bonjour/{nom}', function ($nom) {
    return view($view = 'bonjour', ['nom' => $nom]);
});
Route::get('/livres', [LivreController::class, 'index'])->name('livres.index');
Route::get('/livres/{id}', [LivreController::class, 'show'])->name('livres.show');
Route::get('/about', [LivreController::class, 'about'])->name('about');
