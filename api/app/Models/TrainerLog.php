<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainerLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'trainer_id', // ID Trainer (T1, T2, dst)
        'type',       // 'START' (Clock-in) atau 'END' (Clock-out)
        'time'        // Waktu kejadian (Timestamp)
    ];

    // Opsional: Jika Anda ingin menghubungkan log ini ke User (Trainer)
    public function trainer()
    {
        return $this->belongsTo(User::class, 'trainer_id', 'trainer_id');
    }
}
