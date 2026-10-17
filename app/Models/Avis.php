<?php

namespace App\Models;

use App\Enums\StatutAvis;
use Database\Factories\AvisFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * @property int $id
 * @property int $cours_id
 * @property int $auteur_id
 * @property int $periode_id
 * @property int $note
 * @property string $commentaire
 * @property StatutAvis $statut
 * @property int $nb_signalements
 * @property Carbon $date_creation
 * @property Carbon|null $date_modif
 */
#[Table('avis')]
#[Fillable(['cours_id', 'periode_id', 'note', 'commentaire'])]
#[Hidden(['auteur_id'])]
class Avis extends Model
{
    /** @use HasFactory<AvisFactory> */
    use HasFactory;

    public const CREATED_AT = 'date_creation';

    public const UPDATED_AT = 'date_modif';

    public const SEUIL_SIGNALEMENTS = 3;

    /** @var array<string, mixed> */
    protected $attributes = [
        'statut' => 'publie',
        'nb_signalements' => 0,
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'statut' => StatutAvis::class,
            'note' => 'integer',
            'nb_signalements' => 'integer',
            'date_creation' => 'datetime',
            'date_modif' => 'datetime',
        ];
    }

    /** @param  Builder<Avis>  $query */
    public function scopePublies(Builder $query): void
    {
        $query->where('statut', StatutAvis::Publie);
    }

    /** @return BelongsTo<Cours, $this> */
    public function cours(): BelongsTo
    {
        return $this->belongsTo(Cours::class, 'cours_id');
    }

    /** @return BelongsTo<PeriodeEvaluation, $this> */
    public function periode(): BelongsTo
    {
        return $this->belongsTo(PeriodeEvaluation::class, 'periode_id');
    }

    /** @return HasOne<Reponse, $this> */
    public function reponse(): HasOne
    {
        return $this->hasOne(Reponse::class, 'avis_id');
    }

    /** @return HasMany<Signalement, $this> */
    public function signalements(): HasMany
    {
        return $this->hasMany(Signalement::class, 'avis_id');
    }

    public function estDeLAuteur(User $user): bool
    {
        return $this->auteur_id === $user->id;
    }

    public function signaler(User $user, ?string $motif): void
    {
        DB::transaction(function () use ($user, $motif): void {
            $this->signalements()->create([
                'utilisateur_id' => $user->id,
                'motif' => $motif,
            ]);

            $this->nb_signalements++;

            if ($this->statut === StatutAvis::Publie && $this->nb_signalements >= self::SEUIL_SIGNALEMENTS) {
                $this->statut = StatutAvis::Signale;
            }

            $this->withoutTimestamps(fn () => $this->save());
        });
    }

    public function moderer(StatutAvis $statut): void
    {
        $this->statut = $statut;

        if ($statut === StatutAvis::Publie) {
            $this->nb_signalements = 0;
            $this->signalements()->delete();
        }

        $this->withoutTimestamps(fn () => $this->save());
    }
}
