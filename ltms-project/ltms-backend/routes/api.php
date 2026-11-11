<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LetterController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('jwt.refreshtoken');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
// routes/api.php

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/letters/incoming', [LetterController::class, 'incoming']);
    Route::post('/letters', [LetterController::class, 'store']); //->middleware('role:admin');
    Route::post('/logout', [AuthController::class, 'logout']);

    // Users
    Route::apiResource('users', UserController::class);
    Route::patch('/users/{user}/toggle-active', [UserController::class, 'toggleActive']);

    // Roles & permissions
    Route::apiResource('roles', RoleController::class);
    Route::get('/permissions', [RoleController::class, 'permissions']);

    // Letters (existing)
    Route::get('/letters/incoming', [LetterController::class, 'incoming']);
    Route::post('/letters', [LetterController::class, 'store']);
});
