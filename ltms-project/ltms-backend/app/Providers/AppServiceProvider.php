<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\IAuthRepository;
use App\Repositories\AuthRepository;
use App\Models\User;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;   // ← THIS import is required

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(IAuthRepository::class, AuthRepository::class);
    }

    /**
     * Bootstrap any application services.
     */

    public function boot(): void
    {
        Gate::policy(User::class, UserPolicy::class);
    }
}
