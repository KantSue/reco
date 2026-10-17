<?php

namespace App\Enums;

enum Role: string
{
    case Etudiant = 'etudiant';
    case Ancien = 'ancien';
    case Enseignant = 'enseignant';
    case Admin = 'admin';

    /**
     * Libellé affiché dans l'interface.
     */
    public function label(): string
    {
        return match ($this) {
            self::Etudiant => 'Étudiant',
            self::Ancien => 'Ancien étudiant',
            self::Enseignant => 'Enseignant',
            self::Admin => 'Administration',
        };
    }
}
