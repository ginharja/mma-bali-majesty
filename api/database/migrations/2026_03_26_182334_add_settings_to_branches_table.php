<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSettingsToBranchesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::table('branches', function (Blueprint $table) {
        $table->integer('max_capacity')->default(150);
        $table->string('emergency_phone')->nullable();
        $table->string('wifi_network')->nullable();
        $table->integer('locker_count')->default(50);
        $table->integer('parking_slots')->default(30);
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('branches', function (Blueprint $table) {
            //
        });
    }
}
