<?php

namespace Database\Factories;

use App\Enums\StatutAvis;
use App\Models\Avis;
use App\Models\Cours;
use App\Models\PeriodeEvaluation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Avis> */
class AvisFactory extends Factory
{
    /** @return array<string, mixed> */
    public function definition(): array
    {
        return [
            'cours_id' => Cours::factory(),
            'auteur_id' => User::factory()->etudiant(),
            'periode_id' => PeriodeEvaluation::factory(),
            'note' => fake()->numberBetween(1, 5),
            'commentaire' => fake()->sentence(14),
            'statut' => StatutAvis::Publie,
            'nb_signalements' => 0,
        ];
    }

    public function signale(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => StatutAvis::Signale,
            'nb_signalements' => Avis::SEUIL_SIGNALEMENTS,
        ]);
    }

    public function masque(): static
    {
        return $this->state(fn (array $attributes) => ['statut' => StatutAvis::Masque]);
    }
}
