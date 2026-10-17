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
        Schema::create('recommandation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enseignant_id')->constrained('utilisateur')->cascadeOnDelete();
            $table->foreignId('auteur_id')->constrained('utilisateur')->cascadeOnDelete();
            $table->text('commentaire');
            $table->dateTime('date_creation')->useCurrent();

            $table->unique(['enseignant_id', 'auteur_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recommandation');
    }
};
