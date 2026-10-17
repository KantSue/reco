<?php

namespace App\Enums;

enum StatutAvis: string
{
    case Publie = 'publie';
    case Signale = 'signale';
    case Masque = 'masque';

    public function label(): string
    {
        return match ($this) {
            self::Publie => 'Publié',
            self::Signale => 'Signalé',
            self::Masque => 'Masqué',
        };
    }
}
