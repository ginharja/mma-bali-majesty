<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSupportTicketsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id');
            $table->string('user_name');
            $table->string('subject');
            $table->text('message');
            $table->string('status')->default('open'); // open, replied, closed
            $table->json('replies')->nullable(); // Menyimpan riwayat chat (array)
            $table->string('date');
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
        Schema::dropIfExists('support_tickets');
    }
}
