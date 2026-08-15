<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportTicket extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = ['id', 'user_id', 'user_name', 'subject', 'message', 'status', 'replies', 'date'];

    // Otomatis mengubah string JSON di database menjadi Array di PHP
    protected $casts = [
        'replies' => 'array'
    ];
}
