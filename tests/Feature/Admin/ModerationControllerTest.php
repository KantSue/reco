<?php

namespace Tests\Feature\Admin;

use App\Enums\StatutAvis;
use App\Models\Avis;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ModerationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_cannot_open_the_administration(): void
    {
        $this->actingAs(User::factory()->etudiant()->create())
            ->get(route('admin.moderation.index'))
            ->assertForbidden();
    }

    public function test_moderation_queue_never_reveals_the_author(): void
    {
        $auteur = User::factory()->etudiant()->create(['nom' => 'Zorobabel']);
        Avis::factory()->signale()->create(['auteur_id' => $auteur->id]);

        $this->actingAs(User::factory()->admin()->create())
            ->get(route('admin.moderation.index'))
            ->assertInertia(fn (Assert $page) => $page->has('aTraiter', 1))
            ->assertDontSee('Zorobabel');
    }

    public function test_admin_republishes_a_reported_review_and_resets_its_counter(): void
    {
        $avis = Avis::factory()->signale()->create();

        $this->actingAs(User::factory()->admin()->create())
            ->patch(route('admin.avis.update', $avis), ['statut' => 'publie'])
            ->assertRedirect();

        $avis->refresh();
        $this->assertSame(StatutAvis::Publie, $avis->statut);
        $this->assertSame(0, $avis->nb_signalements);
    }

    public function test_admin_hides_a_review(): void
    {
        $avis = Avis::factory()->signale()->create();

        $this->actingAs(User::factory()->admin()->create())
            ->patch(route('admin.avis.update', $avis), ['statut' => 'masque']);

        $this->assertSame(StatutAvis::Masque, $avis->fresh()->statut);
    }
}
