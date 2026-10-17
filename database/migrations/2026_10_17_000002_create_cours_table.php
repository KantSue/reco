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
        Schema::create('cours', function (Blueprint $table) {
            $table->id();
            $table->string('code_ue', 20)->unique();
            $table->string('intitule', 150);
            $table->foreignId('filiere_id')->constrained('filiere');
            $table->foreignId('enseignant_id')->nullable()->constrained('utilisateur')->nullOnDelete();
            $table->unsignedTinyInteger('semestre');
            $table->text('contenu')->nullable();
            $table->text('chapitres')->nullable();
            $table->string('outils')->nullable();
            $table->text('methode')->nullable();
            $table->text('evaluation')->nullable();
            $table->enum('exigence', ['faible', 'moyenne', 'elevee'])->default('moyenne');
            $table->dateTime('date_maj')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cours');
    }
};
