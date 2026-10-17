<?php

namespace App\Enums;

enum Exigence: string
{
    case Faible = 'faible';
    case Moyenne = 'moyenne';
    case Elevee = 'elevee';

    /**
     * Libellé affiché dans l'interface.
     */
    public function label(): string
    {
        return match ($this) {
            self::Faible => 'Faible',
            self::Moyenne => 'Moyenne',
            self::Elevee => 'Élevée',
        };
    }

    /**
     * Position sur l'échelle de 1 à 3 utilisée par l'indicateur visuel.
     */
    public function niveau(): int
    {
        return match ($this) {
            self::Faible => 1,
            self::Moyenne => 2,
            self::Elevee => 3,
        };
    }
}
