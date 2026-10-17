<?php

namespace Database\Factories;

use App\Enums\Exigence;
use App\Models\Cours;
use App\Models\Filiere;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Cours>
 */
class CoursFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code_ue' => fake()->unique()->bothify('???###'),
            'intitule' => ucfirst(fake()->words(3, true)),
            'filiere_id' => Filiere::factory(),
            'enseignant_id' => User::factory()->enseignant(),
            'semestre' => fake()->numberBetween(1, 6),
            'contenu' => fake()->sentence(12),
            'chapitres' => implode("\n", fake()->sentences(4)),
            'outils' => 'VS Code, Git',
            'methode' => fake()->sentence(10),
            'evaluation' => 'Contrôle continu (40 %), examen final (60 %)',
            'exigence' => fake()->randomElement(Exigence::cases()),
        ];
    }

    /**
     * Fiche non mise à jour depuis plus de 12 mois.
     */
    public function perime(): static
    {
        return $this->state(fn (array $attributes) => ['date_maj' => now()->subMonths(13)]);
    }
}
