<?php

namespace App\Enums;

enum Exigence: string
{
    case Faible = 'faible';
    case Moyenne = 'moyenne';
    case Elevee = 'elevee';

    public function label(): string
    {
        return match ($this) {
            self::Faible => 'Faible',
            self::Moyenne => 'Moyenne',
            self::Elevee => 'Élevée',
        };
    }

    public function niveau(): int
    {
        return match ($this) {
            self::Faible => 1,
            self::Moyenne => 2,
            self::Elevee => 3,
        };
    }
}
