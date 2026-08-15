<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FitnessProgress extends Model
{
    use HasFactory;

    protected $table = 'fitness_progresses';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = ['id', 'user_id', 'weight', 'note', 'date'];
}
