<?php

// app/Models/Letter.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use RichardStyles\EloquentAES\Casts\AESEncrypted;

class Letter extends Model
{
    protected $fillable = [
        'reference_number',
         'office_id',
          'created_by',
          'type',
           'status',
        'priority',
        'encrypted_body',
         'sender_name',
          'letter_date',
        'received_date',
         'current_assignee_id',
          'due_at',
    ];

    protected $casts = [
        'encrypted_body' => AESEncrypted::class, // AES-256-CBC
        'letter_date' => 'date',
        'received_date' => 'date',
        'due_at' => 'datetime',
    ];

    public function translations()
    {
        return $this->hasMany(LetterTranslation::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
