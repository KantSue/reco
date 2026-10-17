<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RecommandationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_recommends_a_teacher_once_and_stays_anonymous(): void
    {
        $etudiant = User::factory()->etudiant()->create(['nom' => 'Zorobabel']);
        $enseignant = User::factory()->enseignant()->create();

        $this->actingAs($etudiant)
            ->post(route('recommandations.store', $enseignant), ['commentaire' => 'Explique avec beaucoup de patience.'])
            ->assertRedirect(route('enseignants.show', $enseignant));

        $this->actingAs($etudiant)
            ->post(route('recommandations.store', $enseignant), ['commentaire' => 'Une seconde recommandation.'])
            ->assertForbidden();

        $this->actingAs(User::factory()->etudiant()->create())
            ->get(route('enseignants.show', $enseignant))
            ->assertInertia(fn (Assert $page) => $page->has('recommandations', 1))
            ->assertDontSee('Zorobabel');
    }

    public function test_teacher_page_is_closed_to_former_students(): void
    {
        $this->actingAs(User::factory()->ancien()->create())
            ->get(route('enseignants.show', User::factory()->enseignant()->create()))
            ->assertForbidden();
    }
}
