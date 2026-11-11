<?php

// database/migrations/xxxx_create_letters_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('letters', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number', 100)->unique();
            $table->foreignId('office_id')->constrained();
            $table->foreignId('created_by')->constrained('users');
            $table->string('type', 20)->default('incoming');
            $table->string('status', 30)->default('registered');
            $table->string('priority', 20)->default('normal');
            $table->text('encrypted_body')->nullable(); // AES-256 via cast
            $table->string('sender_name');
            $table->date('letter_date');
            $table->date('received_date')->nullable();
            $table->foreignId('current_assignee_id')->nullable()->constrained('users');
            $table->timestamp('due_at')->nullable();
            $table->timestamps();
            $table->index(['type', 'status']);
            $table->index('current_assignee_id');
        });

        Schema::create('letter_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_id')->constrained()->cascadeOnDelete();
            $table->string('locale', 10);
            $table->string('subject');
            $table->text('summary')->nullable();
            $table->timestamps();
            $table->unique(['letter_id', 'locale']);
        });
    }
};
