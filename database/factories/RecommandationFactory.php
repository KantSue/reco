<?php

namespace Database\Factories;

use App\Models\Recommandation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Recommandation>
 */
class RecommandationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'enseignant_id' => User::factory()->enseignant(),
            'auteur_id' => User::factory()->etudiant(),
            'commentaire' => fake()->sentence(12),
        ];
    }
}
