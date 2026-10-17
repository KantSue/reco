<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * Inscription d'un étudiant à un cours pour une année universitaire.
 *
 * @property int $etudiant_id
 * @property int $cours_id
 * @property string $annee_universitaire
 */
#[Table('inscription_cours', timestamps: false)]
class InscriptionCours extends Pivot
{
    /**
     * Année universitaire en cours, au format « 2026-2027 » (rentrée en septembre).
     */
    public static function anneeUniversitaireCourante(): string
    {
        $debut = now()->month >= 9 ? now()->year : now()->year - 1;

        return $debut.'-'.($debut + 1);
    }
}
