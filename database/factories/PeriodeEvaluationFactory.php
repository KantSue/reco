<?php

namespace Database\Factories;

use App\Models\PeriodeEvaluation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PeriodeEvaluation>
 */
class PeriodeEvaluationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'libelle' => 'Mi-semestre '.fake()->numberBetween(1, 6),
            'date_debut' => now()->subWeek()->toDateString(),
            'date_fin' => now()->addWeek()->toDateString(),
        ];
    }

    /**
     * Période déjà terminée.
     */
    public function fermee(): static
    {
        return $this->state(fn (array $attributes) => [
            'date_debut' => now()->subMonths(2)->toDateString(),
            'date_fin' => now()->subMonth()->toDateString(),
        ]);
    }
}
