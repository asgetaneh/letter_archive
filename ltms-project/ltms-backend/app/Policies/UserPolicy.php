<?php
namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('users.view');
    }

    public function view(User $user, User $target): bool
    {
        return $user->can('users.view');
    }

    public function create(User $user): bool
    {
        return $user->can('users.create');
    }

    public function update(User $user, User $target): bool
    {
        // Admins can edit anyone; no self-escalation
        return $user->can('users.edit');
    }

    public function delete(User $user, User $target): bool
    {
        // Never allow deleting yourself
        return $user->can('users.delete') && $user->id !== $target->id;
    }
}
