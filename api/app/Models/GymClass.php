<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GymClass extends Model
{
    use HasFactory;
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = ['id', 'branch_id', 'name', 'trainer_id', 'time', 'day', 'duration', 'total', 'slots', 'icon', 'intensity', 'category', 'color', 'status', 'video_url'];

}
