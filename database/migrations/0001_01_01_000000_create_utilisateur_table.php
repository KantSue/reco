<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('utilisateur', function (Blueprint $table) {
            $table->id();
            $table->string('identifiant', 50)->unique();
            $table->string('mot_de_passe_hash');
            $table->string('nom', 80);
            $table->string('prenom', 80);
            $table->string('email', 120)->nullable()->unique();
            $table->enum('role', ['etudiant', 'ancien', 'enseignant', 'admin']);
            $table->year('annee_diplome')->nullable();
            $table->boolean('actif')->default(true);
            $table->rememberToken();
            $table->dateTime('date_creation')->useCurrent();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('utilisateur');
    }
};
