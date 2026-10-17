<?php

namespace App\Http\Resources;

use App\Models\Cours;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Fiche officielle d'un cours.
 *
 * @mixin Cours
 */
class CoursResource extends JsonResource
{
    /**
     * Inclure les statistiques d'avis (note moyenne, nombre d'avis).
     */
    private bool $avecNotes = false;

    public function avecNotes(bool $avecNotes = true): static
    {
        $this->avecNotes = $avecNotes;

        return $this;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code_ue' => $this->code_ue,
            'intitule' => $this->intitule,
            'semestre' => $this->semestre,
            'contenu' => $this->contenu,
            'chapitres' => $this->resource->listeChapitres(),
            'chapitres_texte' => $this->chapitres,
            'outils' => $this->resource->listeOutils(),
            'outils_texte' => $this->outils,
            'methode' => $this->methode,
            'evaluation' => $this->evaluation,
            'exigence' => [
                'value' => $this->exigence->value,
                'label' => $this->exigence->label(),
                'niveau' => $this->exigence->niveau(),
            ],
            'date_maj' => $this->date_maj->toIso8601String(),
            'est_perime' => $this->resource->estPerime(),
            'filiere' => $this->whenLoaded('filiere', fn (): array => [
                'id' => $this->filiere->id,
                'nom' => $this->filiere->nom,
                'niveau' => $this->filiere->niveau,
            ]),
            'enseignant' => $this->whenLoaded('enseignant', fn (): ?array => $this->enseignant ? [
                'id' => $this->enseignant->id,
                'nom_complet' => $this->enseignant->nom_complet,
            ] : null),
            'nb_avis' => $this->when($this->avecNotes, fn (): int => (int) $this->nb_avis),
            'moyenne' => $this->when($this->avecNotes, fn (): ?float => $this->resource->moyenneAffichable()),
        ];
    }
}
