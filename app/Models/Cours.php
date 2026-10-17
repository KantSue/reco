<?php

namespace App\Models;

use App\Enums\Exigence;
use App\Enums\StatutAvis;
use Database\Factories\CoursFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * Fiche officielle d'un cours (UE).
 *
 * @property int $id
 * @property string $code_ue
 * @property string $intitule
 * @property int $filiere_id
 * @property int|null $enseignant_id
 * @property int $semestre
 * @property string|null $contenu
 * @property string|null $chapitres
 * @property string|null $outils
 * @property string|null $methode
 * @property string|null $evaluation
 * @property Exigence $exigence
 * @property Carbon $date_maj
 * @property int|null $nb_avis
 * @property float|string|null $moyenne_brute
 */
#[Table('cours')]
#[Fillable([
    'code_ue', 'intitule', 'filiere_id', 'enseignant_id', 'semestre',
    'contenu', 'chapitres', 'outils', 'methode', 'evaluation', 'exigence',
])]
class Cours extends Model
{
    /** @use HasFactory<CoursFactory> */
    use HasFactory;

    public const CREATED_AT = null;

    public const UPDATED_AT = 'date_maj';

    /**
     * Règle 7 : la moyenne n'est affichée qu'à partir de ce nombre d'avis publiés.
     */
    public const SEUIL_AFFICHAGE_MOYENNE = 5;

    /**
     * Règle 8 : une fiche plus ancienne que ce nombre de mois est signalée.
     */
    public const MOIS_AVANT_PEREMPTION = 12;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'exigence' => Exigence::class,
            'semestre' => 'integer',
            'date_maj' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Filiere, $this>
     */
    public function filiere(): BelongsTo
    {
        return $this->belongsTo(Filiere::class, 'filiere_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function enseignant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'enseignant_id');
    }

    /**
     * @return HasMany<Avis, $this>
     */
    public function avis(): HasMany
    {
        return $this->hasMany(Avis::class, 'cours_id');
    }

    /**
     * @return HasMany<SuiteDonnee, $this>
     */
    public function suitesDonnees(): HasMany
    {
        return $this->hasMany(SuiteDonnee::class, 'cours_id');
    }

    /**
     * @return BelongsToMany<User, $this, InscriptionCours>
     */
    public function etudiants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'inscription_cours', 'cours_id', 'etudiant_id')
            ->using(InscriptionCours::class)
            ->withPivot('annee_universitaire');
    }

    /**
     * Ajoute le nombre d'avis publiés (nb_avis) et leur moyenne brute (moyenne_brute).
     *
     * @param  Builder<Cours>  $query
     */
    public function scopeAvecStatistiques(Builder $query): void
    {
        $query
            ->withCount(['avis as nb_avis' => fn (Builder $avis) => $avis->where('statut', StatutAvis::Publie)])
            ->withAvg(['avis as moyenne_brute' => fn (Builder $avis) => $avis->where('statut', StatutAvis::Publie)], 'note');
    }

    /**
     * Fiches non mises à jour depuis plus de 12 mois.
     *
     * @param  Builder<Cours>  $query
     */
    public function scopePerimes(Builder $query): void
    {
        $query->where('date_maj', '<', now()->subMonths(self::MOIS_AVANT_PEREMPTION));
    }

    /**
     * Moyenne arrondie, ou null tant que le seuil d'anonymat n'est pas atteint.
     * Nécessite le scope avecStatistiques.
     */
    public function moyenneAffichable(): ?float
    {
        if (($this->nb_avis ?? 0) < self::SEUIL_AFFICHAGE_MOYENNE || $this->moyenne_brute === null) {
            return null;
        }

        return round((float) $this->moyenne_brute, 1);
    }

    public function estPerime(): bool
    {
        return $this->date_maj->lt(now()->subMonths(self::MOIS_AVANT_PEREMPTION));
    }

    /**
     * Chapitres sous forme de liste : un par ligne, ou séparés par « ; » avec numérotation.
     *
     * @return list<string>
     */
    public function listeChapitres(): array
    {
        $texte = (string) $this->chapitres;
        $morceaux = str_contains($texte, "\n") ? explode("\n", $texte) : explode(';', $texte);

        return collect($morceaux)
            ->map(fn (string $chapitre): string => trim((string) preg_replace('/^\s*\d+\s*[.)-]\s*/', '', $chapitre)))
            ->filter()
            ->values()
            ->all();
    }

    /**
     * @return list<string>
     */
    public function listeOutils(): array
    {
        return collect(explode(',', (string) $this->outils))
            ->map(fn (string $outil): string => Str::of($outil)->trim()->toString())
            ->filter()
            ->values()
            ->all();
    }
}
