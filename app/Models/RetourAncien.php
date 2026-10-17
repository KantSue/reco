<?php

namespace App\Models;

use Database\Factories\RetourAncienFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $auteur_id
 * @property int $filiere_id
 * @property string $texte
 * @property Carbon $date_creation
 */
#[Table('retour_ancien')]
#[Fillable(['filiere_id', 'texte'])]
class RetourAncien extends Model
{
    /** @use HasFactory<RetourAncienFactory> */
    use HasFactory;

    public const CREATED_AT = 'date_creation';

    public const UPDATED_AT = null;

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'date_creation' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function auteur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'auteur_id');
    }

    /** @return BelongsTo<Filiere, $this> */
    public function filiere(): BelongsTo
    {
        return $this->belongsTo(Filiere::class, 'filiere_id');
    }
}
