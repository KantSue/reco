<?php

namespace App\Models;

use Database\Factories\ReponseFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Droit de réponse de l'enseignant à un avis (une seule réponse par avis).
 *
 * @property int $id
 * @property int $avis_id
 * @property int $enseignant_id
 * @property string $texte
 * @property Carbon $date_creation
 */
#[Table('reponse')]
#[Fillable(['enseignant_id', 'texte'])]
class Reponse extends Model
{
    /** @use HasFactory<ReponseFactory> */
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
     * @return BelongsTo<Avis, $this>
     */
    public function avis(): BelongsTo
    {
        return $this->belongsTo(Avis::class, 'avis_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function enseignant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'enseignant_id');
    }
}
