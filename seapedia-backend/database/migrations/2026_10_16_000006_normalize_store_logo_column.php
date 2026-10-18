<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('stores', 'image_url') && ! Schema::hasColumn('stores', 'logo_url')) {
            Schema::table('stores', function (Blueprint $table): void {
                $table->renameColumn('image_url', 'logo_url');
            });

            return;
        }

        if (! Schema::hasColumn('stores', 'logo_url')) {
            Schema::table('stores', function (Blueprint $table): void {
                $table->string('logo_url', 500)->nullable()->after('phone');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('stores', 'logo_url') && ! Schema::hasColumn('stores', 'image_url')) {
            Schema::table('stores', function (Blueprint $table): void {
                $table->renameColumn('logo_url', 'image_url');
            });
        }
    }
};
