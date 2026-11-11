<?php
// database/migrations/2024_01_01_000001_create_offices_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offices', function (Blueprint $table) {
            $table->id();

            // Hierarchy
            $table->foreignId('parent_id')
                  ->nullable()
                  ->constrained('offices')
                  ->nullOnDelete();

            $table->unsignedTinyInteger('level')->default(0);

            // Materialized paths (comma-separated IDs or JSON)
            $table->text('all_child_office_id')->nullable();
            $table->text('all_child_office_include_office_id')->nullable();

            // Structural metadata
            $table->string('code', 50)->unique();
            $table->string('type', 50);              // ministry, department, unit, branch
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);

            $table->timestamps();
            $table->softDeletes();

            $table->index('parent_id');
            $table->index('level');
            $table->index('is_active');
        });

        Schema::create('office_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('office_id')
                  ->constrained('offices')
                  ->cascadeOnDelete();
            $table->string('locale', 10);            // en, am, fr
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['office_id', 'locale']);
            $table->index('locale');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('office_translations');
        Schema::dropIfExists('offices');
    }
};
