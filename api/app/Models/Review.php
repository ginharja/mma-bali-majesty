<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id', // ID Transaksi unik
        'user_id',    // ID Member yang memberi rating
        'trainer_id', // ID Trainer yang dinilai
        'rating',     // Angka 1-5
        'comment',    // Komentar member
        'is_auto'     // Boolean: true jika rating otomatis 5 oleh sistem
    ];

    // Relasi ke tabel User (Member)
    public function member()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relasi ke tabel User (Trainer)
    public function trainer()
    {
        return $this->belongsTo(User::class, 'trainer_id', 'trainer_id');
    }

    // Relasi ke tabel Booking (Kelas yang diikuti)
    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id', 'transaction_id');
    }
}
