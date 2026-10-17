<?php

namespace Database\Factories;

use App\Models\Filiere;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Filiere>
 */
class FiliereFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => fake()->unique()->randomElement(['Informatique', 'Gestion', 'Mathématiques', 'Droit', 'Économie', 'Physique', 'Biologie', 'Lettres']),
            'niveau' => fake()->randomElement(Filiere::NIVEAUX),
        ];
    }
}
