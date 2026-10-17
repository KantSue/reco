<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('periode_evaluation', function (Blueprint $table) {
            $table->id();
            $table->string('libelle', 100);
            $table->date('date_debut');
            $table->date('date_fin');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('periode_evaluation');
    }
};
