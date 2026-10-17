<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $avis_id
 * @property int $utilisateur_id
 * @property string|null $motif
 * @property Carbon $date_creation
 */
#[Table('signalement')]
#[Fillable(['utilisateur_id', 'motif'])]
#[Hidden(['utilisateur_id'])]
class Signalement extends Model
{
    public const CREATED_AT = 'date_creation';

    public const UPDATED_AT = null;

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'date_creation' => 'datetime',
        ];
    }

    /** @return BelongsTo<Avis, $this> */
    public function avis(): BelongsTo
    {
        return $this->belongsTo(Avis::class, 'avis_id');
    }
}
