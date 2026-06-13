<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Hapus admin lama agar tidak bisa diakses
        User::where('email', 'admin@gmail.com')->delete();

        // Seed new role-based users
        $this->call(UserRoleSeeder::class);
        $this->call(SettingSeeder::class);
        $this->call(ProductSeeder::class);
        $this->call(StoreSeeder::class);
        $this->call(MegaSeeder::class);

        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
