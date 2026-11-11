<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Role::class);

        return RoleResource::collection(
            Role::with('permissions')->orderBy('name')->get()
        );
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Role::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50', 'unique:roles,name'],
            'permissions' => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $role = Role::create(['name' => $validated['name'], 'guard_name' => 'web']);
        $role->syncPermissions($validated['permissions'] ?? []);

        return (new RoleResource($role->load('permissions')))
            ->response()
            ->setStatusCode(201);
    }

    public function update(Request $request, Role $role)
    {
        Gate::authorize('update', $role);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:50', 'unique:roles,name,' . $role->id],
            'permissions' => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $role->update(['name' => $validated['name'] ?? $role->name]);

        if (array_key_exists('permissions', $validated)) {
            $role->syncPermissions($validated['permissions']);
        }

        return new RoleResource($role->fresh('permissions'));
    }

    public function destroy(Role $role)
    {
        Gate::authorize('delete', $role);

        if ($role->name === 'admin') {
            return response()->json(['message' => 'Cannot delete admin role'], 422);
        }

        $role->delete();

        return response()->json(['message' => 'Role deleted']);
    }
    public function permissions()
    {
        Gate::authorize('viewAny', Role::class);
        return \Spatie\Permission\Models\Permission::orderBy('name')->get(['id', 'name']);
    }
}
