<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReviewsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
    Schema::create('reviews', function (Blueprint $table) {
        $table->id();
        $table->string('booking_id')->unique(); // 1x review per booking
        $table->string('user_id');
        $table->string('trainer_id');
        $table->integer('rating');
        $table->text('comment')->nullable();
        $table->boolean('is_auto')->default(false); // Penanda auto-rating 5
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reviews');
    }
}
