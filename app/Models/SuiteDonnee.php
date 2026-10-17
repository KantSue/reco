<?php

namespace App\Models;

use Database\Factories\SuiteDonneeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $cours_id
 * @property int $admin_id
 * @property string $texte
 * @property Carbon $date_creation
 */
#[Table('suite_donnee')]
#[Fillable(['cours_id', 'texte'])]
class SuiteDonnee extends Model
{
    /** @use HasFactory<SuiteDonneeFactory> */
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

    /** @return BelongsTo<Cours, $this> */
    public function cours(): BelongsTo
    {
        return $this->belongsTo(Cours::class, 'cours_id');
    }
}
