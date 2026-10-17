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
        Schema::create('avis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cours_id')->constrained('cours')->cascadeOnDelete();
            $table->foreignId('auteur_id')->constrained('utilisateur')->cascadeOnDelete();
            $table->foreignId('periode_id')->constrained('periode_evaluation');
            $table->unsignedTinyInteger('note');
            $table->text('commentaire');
            $table->enum('statut', ['publie', 'signale', 'masque'])->default('publie');
            $table->unsignedTinyInteger('nb_signalements')->default(0);
            $table->dateTime('date_creation')->useCurrent();
            $table->dateTime('date_modif')->nullable();

            $table->unique(['auteur_id', 'cours_id', 'periode_id']);
            $table->index(['cours_id', 'statut']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('avis');
    }
};
