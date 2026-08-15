<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->integer('price');
            $table->integer('cost');
            $table->integer('stock')->default(0);
            $table->string('icon')->nullable();
            $table->string('category')->nullable();
            $table->text('description')->nullable();
            $table->json('images')->nullable(); // Untuk menyimpan array Base64 foto
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
        Schema::dropIfExists('products');
    }
}
