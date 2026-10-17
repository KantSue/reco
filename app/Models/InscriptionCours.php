<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * @property int $etudiant_id
 * @property int $cours_id
 * @property string $annee_universitaire
 */
#[Table('inscription_cours', timestamps: false)]
class InscriptionCours extends Pivot
{
    public static function anneeUniversitaireCourante(): string
    {
        $debut = now()->month >= 9 ? now()->year : now()->year - 1;

        return $debut.'-'.($debut + 1);
    }
}
