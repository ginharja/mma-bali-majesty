<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id', 'user_id', 'class_id', 'product_id', 'branch_id',
        'class_name', 'trainer', 'date', 'time', 'status', 'payment_status',
        'amount', 'method', 'type', 'icon', 'category', 'description'
    ];
}
