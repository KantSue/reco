<?php

namespace Tests\Feature;

use App\Models\Filiere;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RetourAncienControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_former_student_publishes_an_experience_report(): void
    {
        $ancien = User::factory()->ancien()->create();
        $filiere = Filiere::factory()->create();

        $this->actingAs($ancien)
            ->post(route('retours-anciens.store'), [
                'filiere_id' => $filiere->id,
                'texte' => 'Ne lâchez pas l\'algorithmique, tout repose dessus.',
            ])
            ->assertRedirect(route('retours-anciens.index'));

        $this->assertDatabaseHas('retour_ancien', ['auteur_id' => $ancien->id, 'filiere_id' => $filiere->id]);
    }

    public function test_student_cannot_publish_an_experience_report(): void
    {
        $this->actingAs(User::factory()->etudiant()->create())
            ->post(route('retours-anciens.store'), [
                'filiere_id' => Filiere::factory()->create()->id,
                'texte' => 'Je ne suis pas encore diplômé.',
            ])
            ->assertForbidden();
    }
}
