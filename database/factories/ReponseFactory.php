<?php

namespace Database\Factories;

use App\Models\Avis;
use App\Models\Reponse;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Reponse> */
class ReponseFactory extends Factory
{
    /** @return array<string, mixed> */
    public function definition(): array
    {
        return [
            'avis_id' => Avis::factory(),
            'enseignant_id' => User::factory()->enseignant(),
            'texte' => fake()->sentence(12),
        ];
    }
}
