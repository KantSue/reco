<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('signalement', function (Blueprint $table) {
            $table->id();
            $table->foreignId('avis_id')->constrained('avis')->cascadeOnDelete();
            $table->foreignId('utilisateur_id')->constrained('utilisateur')->cascadeOnDelete();
            $table->string('motif')->nullable();
            $table->dateTime('date_creation')->useCurrent();

            $table->unique(['avis_id', 'utilisateur_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('signalement');
    }
};
