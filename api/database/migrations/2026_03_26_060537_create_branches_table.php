<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBranchesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('branches', function (Blueprint $table) {
        $table->string('id', 50)->primary(); // Pakai string agar kompatibel dengan "B1", "B2"
        $table->string('name');
        $table->string('short');
        $table->text('address')->nullable();
        $table->string('area')->nullable();
        $table->string('phone')->nullable();
        $table->string('hours')->nullable();
        $table->json('facilities')->nullable();
        $table->decimal('rating', 2, 1)->default(5.0);
        $table->integer('reviews')->default(0);
        $table->integer('members')->default(0);
        $table->string('cover')->nullable(); // Emoji icon
        $table->string('color')->nullable(); // Hex color
        $table->json('tags')->nullable();
        $table->string('status')->default('active'); // active / inactive
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
        Schema::dropIfExists('branches');
    }
}
