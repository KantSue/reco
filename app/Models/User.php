<?php

namespace App\Models;

use App\Enums\Role;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * Compte de la plateforme (table « utilisateur ») : étudiant, ancien, enseignant ou administration.
 *
 * @property int $id
 * @property string $identifiant
 * @property string $mot_de_passe_hash
 * @property string $nom
 * @property string $prenom
 * @property string|null $email
 * @property Role $role
 * @property int|null $annee_diplome
 * @property bool $actif
 * @property string|null $remember_token
 * @property Carbon $date_creation
 * @property-read string $nom_complet
 */
#[Table('utilisateur')]
#[Fillable(['identifiant', 'mot_de_passe_hash', 'nom', 'prenom', 'email', 'role', 'annee_diplome', 'actif'])]
#[Hidden(['mot_de_passe_hash', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public const CREATED_AT = 'date_creation';

    public const UPDATED_AT = null;

    /**
     * Colonne contenant le mot de passe haché (bcrypt).
     *
     * @var string
     */
    protected $authPasswordName = 'mot_de_passe_hash';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'mot_de_passe_hash' => 'hashed',
            'role' => Role::class,
            'annee_diplome' => 'integer',
            'actif' => 'boolean',
            'date_creation' => 'datetime',
        ];
    }

    /**
     * Prénom suivi du nom.
     *
     * @return Attribute<string, never>
     */
    protected function nomComplet(): Attribute
    {
        return Attribute::get(fn (): string => trim("{$this->prenom} {$this->nom}"));
    }

    public function hasRole(Role ...$roles): bool
    {
        return in_array($this->role, $roles, true);
    }

    /**
     * @param  Builder<User>  $query
     */
    public function scopeEnseignants(Builder $query): void
    {
        $query->where('role', Role::Enseignant);
    }

    /**
     * Cours assurés par l'enseignant.
     *
     * @return HasMany<Cours, $this>
     */
    public function coursAssures(): HasMany
    {
        return $this->hasMany(Cours::class, 'enseignant_id');
    }

    /**
     * Cours suivis par l'étudiant (table inscription_cours).
     *
     * @return BelongsToMany<Cours, $this, InscriptionCours>
     */
    public function coursSuivis(): BelongsToMany
    {
        return $this->belongsToMany(Cours::class, 'inscription_cours', 'etudiant_id', 'cours_id')
            ->using(InscriptionCours::class)
            ->withPivot('annee_universitaire');
    }

    /**
     * @return HasMany<Recommandation, $this>
     */
    public function recommandationsRecues(): HasMany
    {
        return $this->hasMany(Recommandation::class, 'enseignant_id');
    }

    public function suitLeCours(Cours $cours): bool
    {
        return $this->coursSuivis()->whereKey($cours->id)->exists();
    }
}
