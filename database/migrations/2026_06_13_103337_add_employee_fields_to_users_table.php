<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->after('business_unit');
            $table->string('employee_status', 10)->default('active')->after('phone');
            $table->timestamp('last_login_at')->nullable()->after('employee_status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'employee_status', 'last_login_at']);
        });
    }
};
