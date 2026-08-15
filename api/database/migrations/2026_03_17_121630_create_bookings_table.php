<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookingsTable extends Migration
{
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_id')->unique(); // Menyimpan ID seperti "BK1234" atau "TRX-1234"
            $table->string('user_id');
            $table->string('class_id')->nullable();
            $table->string('product_id')->nullable();
            $table->string('branch_id')->nullable();
            $table->string('class_name'); // Bisa berisi nama kelas atau nama produk
            $table->string('trainer')->nullable();
            $table->string('date');
            $table->string('time')->nullable();
            $table->string('status')->default('upcoming');
            $table->string('payment_status')->default('pending_verification');
            $table->integer('amount');
            $table->string('method');
            $table->string('type'); // "class" atau "purchase"
            $table->string('icon')->nullable();
            $table->string('category')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bookings');
    }
}
