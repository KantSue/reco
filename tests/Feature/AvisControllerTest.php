<?php

namespace Tests\Feature;

use App\Models\Avis;
use App\Models\Cours;
use App\Models\PeriodeEvaluation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AvisControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $etudiant;

    private Cours $cours;

    protected function setUp(): void
    {
        parent::setUp();

        $this->etudiant = User::factory()->etudiant()->create();
        $this->cours = Cours::factory()->create();
        $this->etudiant->coursSuivis()->attach($this->cours, ['annee_universitaire' => '2026-2027']);
    }

    public function test_enrolled_student_posts_a_review_during_an_open_period(): void
    {
        $periode = PeriodeEvaluation::factory()->create();

        $response = $this->actingAs($this->etudiant)->post(route('avis.store', $this->cours), [
            'note' => 4,
            'commentaire' => 'Cours clair, TP utiles pour le projet.',
        ]);

        $response->assertRedirect(route('cours.show', $this->cours));
        $this->assertDatabaseHas('avis', [
            'cours_id' => $this->cours->id,
            'auteur_id' => $this->etudiant->id,
            'periode_id' => $periode->id,
            'note' => 4,
            'statut' => 'publie',
        ]);
    }

    public function test_student_not_enrolled_in_the_course_is_refused(): void
    {
        PeriodeEvaluation::factory()->create();
        $autreEtudiant = User::factory()->etudiant()->create();

        $this->actingAs($autreEtudiant)
            ->post(route('avis.store', $this->cours), ['note' => 4, 'commentaire' => 'Je ne suis pas ce cours.'])
            ->assertForbidden();

        $this->assertDatabaseCount('avis', 0);
    }

    public function test_review_is_refused_when_no_evaluation_period_is_open(): void
    {
        PeriodeEvaluation::factory()->fermee()->create();

        $this->actingAs($this->etudiant)
            ->post(route('avis.store', $this->cours), ['note' => 4, 'commentaire' => 'Cours clair et utile.'])
            ->assertSessionHasErrors('commentaire');

        $this->assertDatabaseCount('avis', 0);
    }

    public function test_student_cannot_post_two_reviews_on_the_same_course_in_one_period(): void
    {
        $periode = PeriodeEvaluation::factory()->create();
        Avis::factory()->for($this->cours, 'cours')->create(['auteur_id' => $this->etudiant->id, 'periode_id' => $periode->id]);

        $this->actingAs($this->etudiant)
            ->post(route('avis.store', $this->cours), ['note' => 2, 'commentaire' => 'Deuxième avis sur le même cours.'])
            ->assertSessionHasErrors([
                'commentaire' => 'Vous avez déjà donné votre avis sur ce cours pour cette période. Vous pouvez le modifier.',
            ]);

        $this->assertDatabaseCount('avis', 1);
    }

    public function test_former_student_cannot_post_a_rated_review(): void
    {
        PeriodeEvaluation::factory()->create();

        $this->actingAs(User::factory()->ancien()->create())
            ->post(route('avis.store', $this->cours), ['note' => 5, 'commentaire' => 'Un ancien ne note pas.'])
            ->assertForbidden();
    }

    public function test_rating_must_be_between_one_and_five(): void
    {
        PeriodeEvaluation::factory()->create();

        $this->actingAs($this->etudiant)
            ->post(route('avis.store', $this->cours), ['note' => 6, 'commentaire' => 'Note hors limites.'])
            ->assertSessionHasErrors(['note' => 'Le champ note doit être compris entre 1 et 5.']);
    }

    public function test_author_can_edit_their_review(): void
    {
        $avis = Avis::factory()->for($this->cours, 'cours')->create(['auteur_id' => $this->etudiant->id, 'note' => 2]);

        $this->actingAs($this->etudiant)
            ->put(route('avis.update', $avis), ['note' => 4, 'commentaire' => 'Finalement le cours est très bien.'])
            ->assertRedirect(route('cours.show', $this->cours));

        $this->assertSame(4, $avis->fresh()->note);
    }

    public function test_another_student_cannot_edit_a_review(): void
    {
        $avis = Avis::factory()->for($this->cours, 'cours')->create(['auteur_id' => $this->etudiant->id]);

        $this->actingAs(User::factory()->etudiant()->create())
            ->put(route('avis.update', $avis), ['note' => 1, 'commentaire' => 'Je modifie un avis qui ne m\'appartient pas.'])
            ->assertForbidden();
    }
}
