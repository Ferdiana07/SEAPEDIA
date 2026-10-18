<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('application_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('reviewer_name', 100);
            $table->unsignedTinyInteger('rating');
            $table->text('comment');
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['is_published', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('application_reviews');
    }
};
