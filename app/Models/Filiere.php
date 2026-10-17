<?php

namespace App\Models;

use Database\Factories\FiliereFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $nom
 * @property string $niveau
 * @property-read string $libelle
 */
#[Table('filiere', timestamps: false)]
#[Fillable(['nom', 'niveau'])]
class Filiere extends Model
{
    /** @use HasFactory<FiliereFactory> */
    use HasFactory;

    /** @var list<string> */
    public const NIVEAUX = ['L1', 'L2', 'L3', 'M1', 'M2'];

    /** @return HasMany<Cours, $this> */
    public function cours(): HasMany
    {
        return $this->hasMany(Cours::class, 'filiere_id');
    }

    /** @return HasMany<RetourAncien, $this> */
    public function retoursAnciens(): HasMany
    {
        return $this->hasMany(RetourAncien::class, 'filiere_id');
    }

    /** @return Attribute<string, never> */
    protected function libelle(): Attribute
    {
        return Attribute::get(fn (): string => "{$this->nom} · {$this->niveau}");
    }
}
