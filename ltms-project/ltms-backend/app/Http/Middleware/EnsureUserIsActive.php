<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && ! $request->user()->is_active) {
            abort(403, 'Account is deactivated.');
        }

        return $next($request);
    }
}
