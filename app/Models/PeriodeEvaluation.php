<?php

namespace App\Models;

use Database\Factories\PeriodeEvaluationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * Période pendant laquelle les étudiants peuvent déposer un avis (mi-semestre, fin de semestre).
 *
 * @property int $id
 * @property string $libelle
 * @property Carbon $date_debut
 * @property Carbon $date_fin
 */
#[Table('periode_evaluation', timestamps: false)]
#[Fillable(['libelle', 'date_debut', 'date_fin'])]
class PeriodeEvaluation extends Model
{
    /** @use HasFactory<PeriodeEvaluationFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_debut' => 'date',
            'date_fin' => 'date',
        ];
    }

    /**
     * @param  Builder<PeriodeEvaluation>  $query
     */
    public function scopeOuvertes(Builder $query): void
    {
        $aujourdhui = now()->toDateString();

        $query->whereDate('date_debut', '<=', $aujourdhui)->whereDate('date_fin', '>=', $aujourdhui);
    }

    /**
     * Période ouverte aujourd'hui, s'il y en a une.
     */
    public static function enCours(): ?self
    {
        return static::query()->ouvertes()->orderByDesc('date_debut')->first();
    }

    public function estOuverte(): bool
    {
        return now()->betweenIncluded($this->date_debut->startOfDay(), $this->date_fin->endOfDay());
    }

    /**
     * @return HasMany<Avis, $this>
     */
    public function avis(): HasMany
    {
        return $this->hasMany(Avis::class, 'periode_id');
    }
}
