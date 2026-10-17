<?php

namespace Tests\Feature;

use App\Models\Avis;
use App\Models\Cours;
use App\Models\PeriodeEvaluation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AccueilControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('home'))->assertRedirect(route('login'));
    }

    public function test_each_role_is_sent_to_its_own_space(): void
    {
        $this->actingAs(User::factory()->enseignant()->create())
            ->get(route('home'))
            ->assertRedirect(route('mes-cours.index'));

        $this->actingAs(User::factory()->ancien()->create())
            ->get(route('home'))
            ->assertRedirect(route('retours-anciens.index'));

        $this->actingAs(User::factory()->admin()->create())
            ->get(route('home'))
            ->assertRedirect(route('admin.moderation.index'));
    }

    public function test_student_home_lists_courses_still_awaiting_their_review(): void
    {
        $etudiant = User::factory()->etudiant()->create();
        $periode = PeriodeEvaluation::factory()->create();
        $coursEvalue = Cours::factory()->create();
        $coursEnAttente = Cours::factory()->create();
        $etudiant->coursSuivis()->attach([$coursEvalue->id, $coursEnAttente->id], ['annee_universitaire' => '2026-2027']);
        Avis::factory()->for($coursEvalue, 'cours')->create(['auteur_id' => $etudiant->id, 'periode_id' => $periode->id]);

        $this->actingAs($etudiant)
            ->get(route('home'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('accueil')
                ->where('periode.libelle', $periode->libelle)
                ->has('coursEnAttente', 1)
                ->where('coursEnAttente.0.id', $coursEnAttente->id));
    }
}
