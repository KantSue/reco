<?php

namespace Database\Factories;

use App\Models\Cours;
use App\Models\SuiteDonnee;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<SuiteDonnee> */
class SuiteDonneeFactory extends Factory
{
    /** @return array<string, mixed> */
    public function definition(): array
    {
        return [
            'cours_id' => Cours::factory(),
            'admin_id' => User::factory()->admin(),
            'texte' => fake()->sentence(14),
        ];
    }
}
