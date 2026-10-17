<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get(route('login'));

        $response->assertOk();
    }

    public function test_demo_accounts_are_only_shown_locally(): void
    {
        $this->get(route('login'))
            ->assertInertia(fn (Assert $page) => $page->where('comptesDemo', []));

        $this->app['env'] = 'local';

        $this->get(route('login'))
            ->assertInertia(fn (Assert $page) => $page
                ->has('comptesDemo', 4)
                ->where('comptesDemo.0.identifiant', 'ETU2026001'));
    }

    public function test_student_authenticates_with_student_number(): void
    {
        $user = User::factory()->etudiant()->create(['identifiant' => 'ETU2026001']);

        $response = $this->post(route('login.store'), [
            'identifiant' => 'ETU2026001',
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('home', absolute: false));
    }

    public function test_invalid_password_is_rejected_with_french_message(): void
    {
        $user = User::factory()->create();

        $response = $this->post(route('login.store'), [
            'identifiant' => $user->identifiant,
            'password' => 'mauvais-mot-de-passe',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors(['identifiant' => 'Identifiant ou mot de passe incorrect.']);
    }

    public function test_deactivated_account_cannot_log_in(): void
    {
        $user = User::factory()->inactif()->create();

        $response = $this->post(route('login.store'), [
            'identifiant' => $user->identifiant,
            'password' => 'password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors(['identifiant' => 'Ce compte est désactivé. Contactez la scolarité.']);
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('logout'));

        $response->assertRedirect(route('home'));
        $this->assertGuest();
    }

    public function test_users_are_rate_limited(): void
    {
        $user = User::factory()->create();

        RateLimiter::increment(md5('login'.implode('|', [strtolower($user->identifiant), '127.0.0.1'])), amount: 5);

        $response = $this->post(route('login.store'), [
            'identifiant' => $user->identifiant,
            'password' => 'wrong-password',
        ]);

        $response->assertTooManyRequests();
    }
}
