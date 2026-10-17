<?php

namespace Database\Factories;

use App\Models\Filiere;
use App\Models\RetourAncien;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RetourAncien>
 */
class RetourAncienFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'auteur_id' => User::factory()->ancien(),
            'filiere_id' => Filiere::factory(),
            'texte' => fake()->paragraph(),
        ];
    }
}
