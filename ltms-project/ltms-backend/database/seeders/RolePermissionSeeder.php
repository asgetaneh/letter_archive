<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'users.view', 'users.create', 'users.edit', 'users.delete',
            'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
            'letters.view', 'letters.create', 'letters.route', 'letters.sign', 'letters.archive',
            'templates.view', 'templates.create', 'templates.edit',
            'reports.view', 'settings.manage',
        ];

        foreach ($permissions as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin->syncPermissions($permissions);

        $registrar = Role::firstOrCreate(['name' => 'registrar', 'guard_name' => 'web']);
        $registrar->syncPermissions([
            'letters.view', 'letters.create', 'letters.route',
            'users.view', 'reports.view',
        ]);

        $officer = Role::firstOrCreate(['name' => 'officer', 'guard_name' => 'web']);
        $officer->syncPermissions(['letters.view', 'letters.create', 'letters.sign']);

        Role::firstOrCreate(['name' => 'viewer', 'guard_name' => 'web'])
            ->syncPermissions(['letters.view']);
    }
}
