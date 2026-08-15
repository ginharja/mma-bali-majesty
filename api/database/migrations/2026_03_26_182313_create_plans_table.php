<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('plans', function (Blueprint $table) {
        $table->string('id')->primary(); // e.g., 'visit', 'monthly'
        $table->string('name');
        $table->integer('price');
        $table->string('period'); // e.g., '/month'
        $table->string('badge')->nullable(); // e.g., 'POPULAR'
        $table->string('icon');
        $table->string('color');
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
        Schema::dropIfExists('plans');
    }
}
