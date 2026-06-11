<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserRoleSeeder extends Seeder
{
    /**
     * Seed akun-akun default untuk Owner, Admin, dan Kasir.
     */
    public function run(): void
    {
        $password = Hash::make('VenusHub123!');

        // ── Owner (Pemilik) ──────────────────────────────────────────────────
        User::updateOrCreate(
            ['email' => 'owner@gmail.com'],
            [
                'name' => 'Pemilik Venus Hub',
                'password' => $password,
                'role' => 'owner',
                'business_unit' => null, // Owner mengakses semua unit
                'email_verified_at' => now(),
            ]
        );

        // ── Admin (Booking Usaha) ────────────────────────────────────────────
        User::updateOrCreate(
            ['email' => 'admin.doorsmeer@gmail.com'],
            [
                'name' => 'Admin Doorsmeer',
                'password' => $password,
                'role' => 'admin',
                'business_unit' => 'doorsmeer',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin.bengkel@gmail.com'],
            [
                'name' => 'Admin Bengkel',
                'password' => $password,
                'role' => 'admin',
                'business_unit' => 'bengkel',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin.rentalps@gmail.com'],
            [
                'name' => 'Admin Rental PS',
                'password' => $password,
                'role' => 'admin',
                'business_unit' => 'rental_ps',
                'email_verified_at' => now(),
            ]
        );

        // ── Kasir (Toko Usaha) ───────────────────────────────────────────────
        User::updateOrCreate(
            ['email' => 'kasir.vapestore@gmail.com'],
            [
                'name' => 'Kasir Vape Store',
                'password' => $password,
                'role' => 'kasir',
                'business_unit' => 'vape_store',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'kasir.coffeeshop@gmail.com'],
            [
                'name' => 'Kasir Coffee Shop',
                'password' => $password,
                'role' => 'kasir',
                'business_unit' => 'coffee_shop',
                'email_verified_at' => now(),
            ]
        );
    }
}
