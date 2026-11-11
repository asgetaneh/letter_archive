<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'fname', 'lname', 'email', 'password', 'role',
        'reset_token', 'reset_token_expires_at',
        'office_id', 'is_active', 'locale',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'reset_token_expires_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function office()
    {
        return $this->belongsTo(Office::class);
    }
}
