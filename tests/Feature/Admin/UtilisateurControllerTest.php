<?php

namespace Tests\Feature\Admin;

use App\Models\Cours;
use App\Models\InscriptionCours;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UtilisateurControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_creates_a_student_account_with_a_hashed_password(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->post(route('admin.comptes.store'), [
                'identifiant' => 'ETU2026100',
                'nom' => 'Rabe',
                'prenom' => 'Kanto',
                'role' => 'etudiant',
                'actif' => '1',
                'mot_de_passe' => 'MotDePasse2026',
            ])
            ->assertSessionHasNoErrors();

        $compte = User::query()->where('identifiant', 'ETU2026100')->firstOrFail();
        $this->assertTrue(Hash::check('MotDePasse2026', $compte->mot_de_passe_hash));
    }

    public function test_former_student_account_requires_a_graduation_year(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->post(route('admin.comptes.store'), [
                'identifiant' => 'ancien.test',
                'nom' => 'Randria',
                'prenom' => 'Andry',
                'role' => 'ancien',
                'actif' => '1',
                'mot_de_passe' => 'MotDePasse2026',
            ])
            ->assertSessionHasErrors('annee_diplome');
    }

    public function test_admin_cannot_remove_their_own_admin_rights(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->put(route('admin.comptes.update', $admin), [
                'identifiant' => $admin->identifiant,
                'nom' => $admin->nom,
                'prenom' => $admin->prenom,
                'role' => 'admin',
                'actif' => '0',
            ])
            ->assertSessionHasErrors('role');

        $this->assertTrue($admin->fresh()->actif);
    }

    public function test_admin_sets_the_courses_a_student_follows_this_year(): void
    {
        $etudiant = User::factory()->etudiant()->create();
        [$ancienCours, $nouveauCours] = Cours::factory()->count(2)->create();
        $etudiant->coursSuivis()->attach($ancienCours, ['annee_universitaire' => InscriptionCours::anneeUniversitaireCourante()]);

        $this->actingAs(User::factory()->admin()->create())
            ->put(route('admin.comptes.inscriptions', $etudiant), ['cours' => [$nouveauCours->id]])
            ->assertSessionHasNoErrors();

        $this->assertFalse($etudiant->suitLeCours($ancienCours));
        $this->assertTrue($etudiant->suitLeCours($nouveauCours));
    }
}
