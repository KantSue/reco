<?php

namespace Tests\Feature;

use App\Models\Cours;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MesCoursControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, string>
     */
    private function fiche(): array
    {
        return [
            'contenu' => 'Bases de la programmation.',
            'chapitres' => "Variables\nBoucles",
            'outils' => 'Python 3',
            'methode' => 'Cours magistral puis TD.',
            'evaluation' => 'Examen final (100 %)',
            'exigence' => 'elevee',
        ];
    }

    public function test_teacher_update_renews_the_last_update_date(): void
    {
        $cours = Cours::factory()->perime()->create();
        $this->assertTrue($cours->estPerime());

        $this->actingAs($cours->enseignant)
            ->put(route('mes-cours.update', $cours), $this->fiche())
            ->assertRedirect(route('mes-cours.index', ['cours' => $cours->id]));

        $cours->refresh();
        $this->assertSame('Bases de la programmation.', $cours->contenu);
        $this->assertFalse($cours->estPerime());
    }

    public function test_teacher_cannot_update_another_teachers_course(): void
    {
        $cours = Cours::factory()->create();

        $this->actingAs(User::factory()->enseignant()->create())
            ->put(route('mes-cours.update', $cours), $this->fiche())
            ->assertForbidden();
    }

    public function test_student_cannot_open_the_teacher_space(): void
    {
        $this->actingAs(User::factory()->etudiant()->create())
            ->get(route('mes-cours.index'))
            ->assertForbidden();
    }
}
