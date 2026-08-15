<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false; // Karena kita pakai string ID (B1, B2)
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'name', 'short', 'address', 'area', 'phone', 'hours',
        'facilities', 'rating', 'reviews', 'members', 'cover', 'color', 'tags', 'status'
    ];

    protected $casts = [
        'facilities' => 'array',
        'tags' => 'array',
    ];
}
