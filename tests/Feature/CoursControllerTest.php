<?php

namespace Tests\Feature;

use App\Models\Avis;
use App\Models\Cours;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CoursControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_review_author_never_appears_in_the_page_source(): void
    {
        $auteur = User::factory()->etudiant()->create([
            'identifiant' => 'ETU9999123',
            'nom' => 'Zorobabel',
            'prenom' => 'Quentinette',
        ]);
        $cours = Cours::factory()->create();
        Avis::factory()->for($cours, 'cours')->create(['auteur_id' => $auteur->id, 'commentaire' => 'Très bon cours, bien expliqué.']);

        $response = $this->actingAs(User::factory()->etudiant()->create())->get(route('cours.show', $cours));

        $response->assertOk()
            ->assertSee('Très bon cours, bien expliqué.')
            ->assertDontSee('Zorobabel')
            ->assertDontSee('Quentinette')
            ->assertDontSee('ETU9999123')
            ->assertDontSee('auteur_id');
    }

    public function test_review_author_is_hidden_from_the_course_teacher(): void
    {
        $auteur = User::factory()->etudiant()->create(['nom' => 'Zorobabel']);
        $cours = Cours::factory()->create();
        Avis::factory()->for($cours, 'cours')->create(['auteur_id' => $auteur->id]);

        $this->actingAs($cours->enseignant)
            ->get(route('cours.show', $cours))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('peutVoirAvis', true)->has('avis', 1))
            ->assertDontSee('Zorobabel');
    }

    public function test_guest_sees_the_official_course_sheet_without_reviews(): void
    {
        $cours = Cours::factory()->create();
        Avis::factory()->for($cours, 'cours')->create(['commentaire' => 'Commentaire réservé aux membres.']);

        $this->get(route('cours.show', $cours))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('cours/show')
                ->where('cours.intitule', $cours->intitule)
                ->where('peutVoirAvis', false)
                ->has('avis', 0)
                ->missing('cours.moyenne'))
            ->assertDontSee('Commentaire réservé aux membres.');
    }

    public function test_teacher_of_another_course_cannot_read_its_reviews(): void
    {
        $cours = Cours::factory()->create();
        Avis::factory()->for($cours, 'cours')->create();

        $this->actingAs(User::factory()->enseignant()->create())
            ->get(route('cours.show', $cours))
            ->assertInertia(fn (Assert $page) => $page->where('peutVoirAvis', false)->has('avis', 0));
    }

    public function test_hidden_and_reported_reviews_are_not_shown(): void
    {
        $cours = Cours::factory()->create();
        Avis::factory()->for($cours, 'cours')->create();
        Avis::factory()->for($cours, 'cours')->signale()->create();
        Avis::factory()->for($cours, 'cours')->masque()->create();

        $this->actingAs(User::factory()->etudiant()->create())
            ->get(route('cours.show', $cours))
            ->assertInertia(fn (Assert $page) => $page->has('avis', 1));
    }

    public function test_average_is_hidden_below_five_reviews(): void
    {
        $cours = Cours::factory()->create();
        Avis::factory()->count(4)->for($cours, 'cours')->create(['note' => 4]);

        $this->actingAs(User::factory()->etudiant()->create())
            ->get(route('cours.show', $cours))
            ->assertInertia(fn (Assert $page) => $page
                ->where('cours.nb_avis', 4)
                ->where('cours.moyenne', null)
                ->where('repartition', null));
    }

    public function test_average_is_shown_from_five_reviews(): void
    {
        $cours = Cours::factory()->create();
        foreach ([5, 5, 4, 4, 3] as $note) {
            Avis::factory()->for($cours, 'cours')->create(['note' => $note]);
        }

        $this->actingAs(User::factory()->etudiant()->create())
            ->get(route('cours.show', $cours))
            ->assertInertia(fn (Assert $page) => $page
                ->where('cours.nb_avis', 5)
                ->where('cours.moyenne', 4.2)
                ->where('repartition.5', 2));
    }

    public function test_search_matches_course_title_or_teacher_name(): void
    {
        $enseignant = User::factory()->enseignant()->create(['nom' => 'Rasoanaivo']);
        $parEnseignant = Cours::factory()->create(['intitule' => 'Programmation web', 'enseignant_id' => $enseignant->id]);
        $parIntitule = Cours::factory()->create(['intitule' => 'Algorithmique avancée']);
        Cours::factory()->create(['intitule' => 'Comptabilité générale']);

        $this->get(route('cours.index', ['q' => 'Algorithm']))
            ->assertInertia(fn (Assert $page) => $page->has('cours', 1)->where('cours.0.id', $parIntitule->id));

        $this->get(route('cours.index', ['q' => 'Rasoanaivo']))
            ->assertInertia(fn (Assert $page) => $page->has('cours', 1)->where('cours.0.id', $parEnseignant->id));
    }
}
