<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inscription_cours', function (Blueprint $table) {
            $table->foreignId('etudiant_id')->constrained('utilisateur')->cascadeOnDelete();
            $table->foreignId('cours_id')->constrained('cours')->cascadeOnDelete();
            $table->char('annee_universitaire', 9);
            $table->primary(['etudiant_id', 'cours_id', 'annee_universitaire']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inscription_cours');
    }
};
