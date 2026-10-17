<?php

namespace Tests\Feature;

use App\Enums\StatutAvis;
use App\Models\Avis;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SignalementControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_third_report_hides_the_review_until_moderation(): void
    {
        $avis = Avis::factory()->create();

        foreach (User::factory()->etudiant()->count(3)->create() as $index => $etudiant) {
            $this->actingAs($etudiant)
                ->post(route('signalements.store', $avis), ['motif' => 'Insultes'])
                ->assertRedirect();

            $statutAttendu = $index < 2 ? StatutAvis::Publie : StatutAvis::Signale;
            $this->assertSame($statutAttendu, $avis->fresh()->statut);
        }

        $this->assertSame(3, $avis->fresh()->nb_signalements);
    }

    public function test_user_cannot_report_the_same_review_twice(): void
    {
        $avis = Avis::factory()->create();
        $etudiant = User::factory()->etudiant()->create();

        $this->actingAs($etudiant)->post(route('signalements.store', $avis), ['motif' => 'Hors sujet']);
        $this->actingAs($etudiant)->post(route('signalements.store', $avis), ['motif' => 'Hors sujet'])->assertForbidden();

        $this->assertSame(1, $avis->fresh()->nb_signalements);
    }

    public function test_teacher_can_only_report_reviews_on_their_own_courses(): void
    {
        $avis = Avis::factory()->create();

        $this->actingAs(User::factory()->enseignant()->create())
            ->post(route('signalements.store', $avis))
            ->assertForbidden();

        $this->actingAs($avis->cours->enseignant)
            ->post(route('signalements.store', $avis))
            ->assertRedirect();
    }
}
