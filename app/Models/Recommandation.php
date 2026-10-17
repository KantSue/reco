<?php

namespace App\Models;

use Database\Factories\RecommandationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Recommandation anonyme d'un enseignant par un étudiant.
 *
 * @property int $id
 * @property int $enseignant_id
 * @property int $auteur_id
 * @property string $commentaire
 * @property Carbon $date_creation
 */
#[Table('recommandation')]
#[Fillable(['commentaire'])]
#[Hidden(['auteur_id'])]
class Recommandation extends Model
{
    /** @use HasFactory<RecommandationFactory> */
    use HasFactory;

    public const CREATED_AT = 'date_creation';

    public const UPDATED_AT = null;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_creation' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function enseignant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'enseignant_id');
    }
}
