<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Ubah kolom role dari enum('user','admin') menjadi string agar bisa menyimpan 'owner','kasir'
        // Untuk MySQL: modifikasi kolom enum
        DB::statement("ALTER TABLE users MODIFY COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user'");

        // 2. Tambahkan kolom business_unit
        Schema::table('users', function (Blueprint $table) {
            $table->string('business_unit', 30)->nullable()->after('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('business_unit');
        });

        // Kembalikan ke enum
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('user','admin') NOT NULL DEFAULT 'user'");
    }
};
