<?php

namespace Tests\Feature;

use App\Models\Avis;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReponseControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_replies_once_to_a_review_on_their_course(): void
    {
        $avis = Avis::factory()->create();
        $enseignant = $avis->cours->enseignant;

        $this->actingAs($enseignant)
            ->post(route('reponses.store', $avis), ['texte' => 'Merci, les corrigés seront publiés.'])
            ->assertRedirect();

        $this->assertDatabaseHas('reponse', ['avis_id' => $avis->id, 'enseignant_id' => $enseignant->id]);

        $this->actingAs($enseignant)
            ->post(route('reponses.store', $avis), ['texte' => 'Une deuxième réponse.'])
            ->assertForbidden();
    }

    public function test_teacher_cannot_reply_to_a_review_on_another_course(): void
    {
        $avis = Avis::factory()->create();

        $this->actingAs(User::factory()->enseignant()->create())
            ->post(route('reponses.store', $avis), ['texte' => 'Je réponds à la place d\'un collègue.'])
            ->assertForbidden();

        $this->assertDatabaseCount('reponse', 0);
    }
}
