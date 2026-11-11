<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin', 'guard_name' => 'web']);

        $admin = User::firstOrCreate(
            ['email' => 'admin@ltms.test'],
            [
                'fname' => 'System Admin',
                'lname' => 'System Admin',
                'password' => bcrypt('ChangeMe123!@'),
                // 'office_id' => 1,
              //  'locale' => 'en',
                // 'is_active' => true,
            ]
        );

        $admin->assignRole('admin');
    }
}
