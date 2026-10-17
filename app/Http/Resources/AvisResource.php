<?php

namespace App\Http\Resources;

use App\Enums\Role;
use App\Models\Avis;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Représentation publique d'un avis.
 * NF1 : l'auteur n'est jamais transmis au navigateur, ni à l'administration.
 *
 * @mixin Avis
 */
class AvisResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $estAdmin = $request->user()?->role === Role::Admin;

        return [
            'id' => $this->id,
            'note' => $this->note,
            'commentaire' => $this->commentaire,
            'date' => $this->date_creation->toIso8601String(),
            'modifie' => $this->date_modif !== null && $this->date_modif->gt($this->date_creation),
            'est_le_mien' => $request->user() !== null && $this->resource->estDeLAuteur($request->user()),
            'periode' => $this->whenLoaded('periode', fn (): string => $this->periode->libelle),
            'cours' => $this->whenLoaded('cours', fn (): array => [
                'id' => $this->cours->id,
                'code_ue' => $this->cours->code_ue,
                'intitule' => $this->cours->intitule,
            ]),
            'reponse' => $this->whenLoaded('reponse', fn (): ?array => $this->reponse ? [
                'texte' => $this->reponse->texte,
                'date' => $this->reponse->date_creation->toIso8601String(),
                'enseignant' => $this->reponse->enseignant?->nom_complet,
            ] : null),
            'statut' => $this->when($estAdmin, fn (): array => [
                'value' => $this->statut->value,
                'label' => $this->statut->label(),
            ]),
            'nb_signalements' => $this->when($estAdmin, $this->nb_signalements),
            'motifs' => $this->when(
                $estAdmin && $this->relationLoaded('signalements'),
                fn (): array => $this->signalements->pluck('motif')->filter()->values()->all(),
            ),
        ];
    }
}
