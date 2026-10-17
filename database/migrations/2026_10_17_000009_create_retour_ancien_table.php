<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('retour_ancien', function (Blueprint $table) {
            $table->id();
            $table->foreignId('auteur_id')->constrained('utilisateur')->cascadeOnDelete();
            $table->foreignId('filiere_id')->constrained('filiere')->cascadeOnDelete();
            $table->text('texte');
            $table->dateTime('date_creation')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('retour_ancien');
    }
};
