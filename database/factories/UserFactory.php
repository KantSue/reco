<?php

namespace Database\Factories;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'identifiant' => 'ETU'.fake()->unique()->numerify('#######'),
            'mot_de_passe_hash' => static::$password ??= Hash::make('password'),
            'nom' => fake()->lastName(),
            'prenom' => fake()->firstName(),
            'email' => fake()->unique()->safeEmail(),
            'role' => Role::Etudiant,
            'annee_diplome' => null,
            'actif' => true,
        ];
    }

    public function etudiant(): static
    {
        return $this->state(fn (array $attributes) => ['role' => Role::Etudiant]);
    }

    public function enseignant(): static
    {
        return $this->state(fn (array $attributes) => [
            'identifiant' => fake()->unique()->userName(),
            'role' => Role::Enseignant,
        ]);
    }

    public function ancien(): static
    {
        return $this->state(fn (array $attributes) => [
            'identifiant' => 'ancien.'.fake()->unique()->userName(),
            'role' => Role::Ancien,
            'annee_diplome' => fake()->numberBetween(2018, 2026),
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'identifiant' => 'admin.'.fake()->unique()->userName(),
            'role' => Role::Admin,
        ]);
    }

    /**
     * Compte désactivé par l'administration.
     */
    public function inactif(): static
    {
        return $this->state(fn (array $attributes) => ['actif' => false]);
    }
}
