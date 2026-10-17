<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('filiere', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->enum('niveau', ['L1', 'L2', 'L3', 'M1', 'M2']);
            $table->unique(['nom', 'niveau']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('filiere');
    }
};
