<?php

namespace App\Http\Middleware;

use App\Enums\Role;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /** @param  Closure(Request): (Response)  $next */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        $rolesAutorises = array_map(fn (string $role): Role => Role::from($role), $roles);

        abort_unless($user !== null && $user->hasRole(...$rolesAutorises), 403);

        return $next($request);
    }
}
