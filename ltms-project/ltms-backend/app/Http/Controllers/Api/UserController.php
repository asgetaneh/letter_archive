<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', User::class);

        $users = User::query()
            ->with('roles', 'office')
            ->when($request->search, fn ($q, $s) =>
                $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%")
            )
            ->when($request->office_id, fn ($q, $id) => $q->where('office_id', $id))
            ->when($request->role, fn ($q, $role) =>
                $q->whereHas('roles', fn ($r) => $r->where('name', $role))
            )
            ->orderBy('name')
            ->paginate($request->per_page ?? 15);

        return UserResource::collection($users);
    }

    public function store(StoreUserRequest $request)
    {
        $user = DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
                'office_id' => $request->office_id,
                'locale' => $request->locale ?? 'en',
                'is_active' => $request->boolean('is_active', true),
            ]);

            $user->syncRoles($request->input('roles', []));

            return $user;
        });

        return (new UserResource($user->load('roles', 'office')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(User $user)
    {
        Gate::authorize('view', $user);

        return new UserResource($user->load('roles', 'permissions', 'office'));
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        Gate::authorize('update', $user);

        DB::transaction(function () use ($request, $user) {
            $data = $request->only(['name', 'email', 'office_id', 'locale', 'is_active']);

            if ($request->filled('password')) {
                $data['password'] = $request->password;
            }

            $user->update($data);

            if ($request->has('roles')) {
                $user->syncRoles($request->input('roles', []));
            }
        });

        return new UserResource($user->fresh('roles', 'office'));
    }

    public function destroy(User $user)
    {
        Gate::authorize('delete', $user);

        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }

    public function toggleActive(User $user)
    {
        Gate::authorize('update', $user);

        $user->update(['is_active' => ! $user->is_active]);

        return new UserResource($user->load('roles', 'office'));
    }
}
