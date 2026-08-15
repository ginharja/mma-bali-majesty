<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGymClassesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
   public function up()
    {
        Schema::create('gym_classes', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('branch_id')->nullable();
            $table->string('name');
            $table->string('trainer_id')->nullable();
            $table->string('time');
            $table->string('day');
            $table->string('duration');
            $table->integer('total')->default(15);
            $table->integer('slots')->default(15);
            $table->string('icon')->default('🏋️');
            $table->string('intensity')->default('MED');
            $table->string('category')->default('HIIT');
            $table->string('color')->default('#CCFF00');
            $table->string('status')->default('active');
            $table->string('video_url')->nullable();
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
        Schema::dropIfExists('gym_classes');
    }
}
