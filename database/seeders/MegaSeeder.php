<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\DoorsmeerBooking;
use App\Models\BengkelBooking;
use App\Models\RentalPsBooking;
use App\Models\StoreOrder;
use App\Models\StoreOrderItem;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Str;

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  MEGA SEEDER — Venus Space Stress Test Data                ║
 * ║  ~11.000+ records · 90 hari · 5 unit usaha                ║
 * ║  Anggapan: bisnis sangat sukses, transaksi ramai per hari  ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Jalankan:  php artisan db:seed --class=MegaSeeder
 */
class MegaSeeder extends Seeder
{
    // ── Constants ─────────────────────────────────────────────────────────────

    private const START_DATE = '2026-03-15';
    private const END_DATE   = '2026-06-13';

    // Realistic Indonesian names for dummy customers
    private const CUSTOMER_NAMES = [
        'Andi Pratama', 'Budi Santoso', 'Citra Dewi', 'Dian Permata', 'Eka Saputra',
        'Fani Rahayu', 'Gunawan Adi', 'Hana Safitri', 'Irfan Maulana', 'Joko Widodo',
        'Kartika Sari', 'Luki Firmansyah', 'Maya Anggita', 'Naufal Rizky', 'Olivia Putri',
        'Putra Ramadhan', 'Qori Amalia', 'Rizki Hidayat', 'Sinta Maharani', 'Tegar Prakoso',
        'Utami Wulandari', 'Vino Bastian', 'Winda Kusuma', 'Xena Valentina', 'Yogi Permana',
        'Zahra Azzahra', 'Agus Setiawan', 'Bayu Nugroho', 'Cahya Indah', 'Deni Kurniawan',
        'Elsa Fitria', 'Farhan Akbar', 'Gita Nirmala', 'Hadi Suryanto', 'Intan Permatasari',
        'Jihan Aulia', 'Kevin Ardiansyah', 'Lestari Putri', 'M. Fauzan', 'Nadia Safira',
        'Oscar Tanujaya', 'Puspita Sari', 'Rendi Mahendra', 'Sari Wulan', 'Teguh Prasetya',
        'Umi Kalsum', 'Vicky Ananda', 'Wahyu Saputro', 'Yanti Marlina', 'Zulfikar Hakim',
    ];

    // Realistic Sumatran license plates
    private const PLATE_PREFIXES = ['BK', 'BB', 'BA', 'BD', 'BL', 'BM', 'BN', 'BE'];
    private const PLATE_SUFFIXES = ['AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'PQ', 'RS', 'TU', 'VW', 'XY', 'ZA', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'XYZ'];

    private const VEHICLE_CLASSES = ['City Car / Sedan', 'SUV / MPV', 'Pickup / Double Cabin', 'Motor', 'Minibus'];

    // ── Doorsmeer services (match frontend index.tsx) ──
    private const DOORSMEER_SERVICES = [
        ['id' => 'basic',     'name' => 'Basic Wash',     'subtitle' => 'Exterior & Foam Wash',     'price' => 35000,  'duration' => '20 menit'],
        ['id' => 'premium',   'name' => 'Premium Wash',   'subtitle' => 'Interior & Vacuum Included','price' => 65000,  'duration' => '45 menit'],
        ['id' => 'detailing', 'name' => 'Full Detailing', 'subtitle' => 'Engine & Coating',          'price' => 150000, 'duration' => '2 Jam'],
    ];

    // ── Bengkel services ──
    private const BENGKEL_SERVICES = [
        ['id' => 'ganti_oli',     'name' => 'Ganti Oli',       'subtitle' => 'Penggantian Oli Mesin',       'price' => 75000,  'duration' => '15 menit'],
        ['id' => 'servis_ringan', 'name' => 'Servis Ringan',   'subtitle' => 'Pengecekan Rutin',            'price' => 150000, 'duration' => '45 menit'],
        ['id' => 'servis_berat',  'name' => 'Servis Berat',    'subtitle' => 'Turun Mesin / Overhaul',      'price' => 500000, 'duration' => '2+ Jam'],
    ];

    // ── Rental PS services ──
    private const RENTAL_PS_SERVICES = [
        ['id' => 'ps3', 'name' => 'Sewa PS3', 'subtitle' => 'PlayStation 3 Console', 'price' => 15000],
        ['id' => 'ps4', 'name' => 'Sewa PS4', 'subtitle' => 'PlayStation 4 Console', 'price' => 30000],
        ['id' => 'ps5', 'name' => 'Sewa PS5', 'subtitle' => 'PlayStation 5 Console', 'price' => 50000],
    ];

    // Stall names per unit
    private const DOORSMEER_STALLS = ['Stall 1', 'Stall 2', 'Stall 3'];
    private const BENGKEL_STALLS   = ['Pit 1', 'Pit 2', 'Pit 3'];
    private const RENTAL_STALLS    = ['TV 1', 'TV 2', 'TV 3', 'TV 4', 'TV 5'];

    // Walkin customer names for non-registered users
    private const WALKIN_NAMES = [
        'Pak Bambang', 'Bu Ratna', 'Mas Agung', 'Mbak Tika', 'Pak Hendra',
        'Bu Siti', 'Mas Doni', 'Mbak Rina', 'Pak Surya', 'Bu Dewi',
        'Mas Arif', 'Mbak Lina', 'Pak Rudi', 'Bu Ani', 'Mas Fajar',
    ];

    // Track product sold counts for stock update
    private array $productSoldCounts = [];

    // ── Run ──────────────────────────────────────────────────────────────────

    public function run(): void
    {
        $this->command->info('');
        $this->command->info('╔══════════════════════════════════════════════╗');
        $this->command->info('║  🚀 MEGA SEEDER — Venus Space Stress Test   ║');
        $this->command->info('╚══════════════════════════════════════════════╝');
        $this->command->info('');

        // 1. Create 50 dummy pelanggan users
        $customerIds = $this->createCustomerUsers();
        $this->command->info("✓ Created " . count($customerIds) . " customer users");

        // Get admin user for walk-ins
        $adminUser = User::where('role', 'admin')->first();
        $adminId = $adminUser ? $adminUser->id : ($customerIds[0] ?? 1);

        // 2. Generate dates
        $startDate = Carbon::parse(self::START_DATE);
        $endDate   = Carbon::parse(self::END_DATE);
        $dates     = [];
        $d = $startDate->copy();
        while ($d->lte($endDate)) {
            $dates[] = $d->copy();
            $d->addDay();
        }
        $totalDays = count($dates);
        $this->command->info("  Period: {$startDate->format('d M Y')} → {$endDate->format('d M Y')} ({$totalDays} days)");
        $this->command->info('');

        // 3. Seed each unit
        $dsCount = $this->seedDoorsmeerBookings($dates, $customerIds, $adminId);
        $this->command->info("✓ Doorsmeer:   {$dsCount} bookings");

        $bgCount = $this->seedBengkelBookings($dates, $customerIds, $adminId);
        $this->command->info("✓ Bengkel:     {$bgCount} bookings");

        $psCount = $this->seedRentalPsBookings($dates, $customerIds, $adminId);
        $this->command->info("✓ Rental PS:   {$psCount} bookings");

        $coffeeCount = $this->seedStoreOrders($dates, $customerIds, 'COFFEE SHOP', 'VNC', 35, 55);
        $this->command->info("✓ Coffee Shop: {$coffeeCount} orders");

        $vapeCount = $this->seedStoreOrders($dates, $customerIds, 'VAPE STORE', 'VNX', 18, 32);
        $this->command->info("✓ Vape Store:  {$vapeCount} orders");

        // 4. Update product stock & sold counts
        $this->updateProductStocks();
        $this->command->info('');
        $this->command->info("✓ Product stocks updated");

        $total = $dsCount + $bgCount + $psCount + $coffeeCount + $vapeCount;
        $this->command->info('');
        $this->command->info("═══════════════════════════════════════════════");
        $this->command->info("  TOTAL: {$total} records seeded successfully!");
        $this->command->info("═══════════════════════════════════════════════");
        $this->command->info('');
    }

    // ── Create 50 customer users ──────────────────────────────────────────────

    private function createCustomerUsers(): array
    {
        $ids = [];

        foreach (self::CUSTOMER_NAMES as $i => $name) {
            $slug = strtolower(str_replace([' ', '.'], ['_', ''], $name));
            $user = User::firstOrCreate(
                ['email' => "{$slug}@venustest.id"],
                [
                    'name'              => $name,
                    'password'          => bcrypt('password123'),
                    'role'              => 'pelanggan',
                    'email_verified_at' => now()->subDays(rand(30, 120)),
                ]
            );
            $ids[] = $user->id;
        }

        return $ids;
    }

    // ── Doorsmeer Bookings ────────────────────────────────────────────────────

    private function seedDoorsmeerBookings(array $dates, array $customerIds, int $adminId): int
    {
        $count = 0;
        $rows = [];

        foreach ($dates as $date) {
            $isWeekend = $date->isWeekend();
            $isRecent = $date->gte(Carbon::now()->subDays(2));
            $baseCount = rand(15, 25);
            $dailyCount = $isWeekend ? (int)($baseCount * 1.4) : $baseCount;

            for ($i = 0; $i < $dailyCount; $i++) {
                $service  = self::DOORSMEER_SERVICES[array_rand(self::DOORSMEER_SERVICES)];
                $isWalkin = rand(1, 100) <= 30; // 30% walk-in
                $userId   = $isWalkin ? $adminId : $customerIds[array_rand($customerIds)];
                $prefix   = $isWalkin ? 'WK' : 'DS';

                // Determine status
                $status = $this->determineBookingStatus($date, $isRecent);
                $createdAt = $this->randomTimestamp($date, 8, 17);

                $verifiedAt = null;
                $bayAssignedAt = null;
                $doneAt = null;
                $stall = null;
                $adminNotes = $isWalkin
                    ? 'Walk-in Customer: ' . self::WALKIN_NAMES[array_rand(self::WALKIN_NAMES)]
                    : null;

                if (in_array($status, ['verified', 'in_queue', 'washing', 'done'])) {
                    $verifiedAt = $createdAt->copy()->addMinutes(rand(2, 15));
                }
                if (in_array($status, ['washing', 'done'])) {
                    $bayAssignedAt = ($verifiedAt ?? $createdAt)->copy()->addMinutes(rand(5, 40));
                    $stall = self::DOORSMEER_STALLS[array_rand(self::DOORSMEER_STALLS)];
                }
                if ($status === 'done') {
                    $doneAt = ($bayAssignedAt ?? $createdAt)->copy()->addMinutes(rand(20, 120));
                    $stall = null; // bay released
                }
                if ($status === 'cancelled') {
                    $adminNotes = $adminNotes ?: 'Pelanggan tidak datang';
                }

                $rows[] = [
                    'booking_code'     => $prefix . '-' . strtoupper(Str::random(5)),
                    'user_id'          => $userId,
                    'service_id'       => $service['id'],
                    'service_name'     => $service['name'],
                    'service_subtitle' => $service['subtitle'],
                    'service_price'    => $service['price'],
                    'service_duration' => $service['duration'],
                    'vehicle_class'    => self::VEHICLE_CLASSES[array_rand(self::VEHICLE_CLASSES)],
                    'license_plate'    => $this->randomPlate(),
                    'status'           => $status,
                    'stall'            => $stall,
                    'admin_notes'      => $adminNotes,
                    'verified_at'      => $verifiedAt,
                    'bay_assigned_at'  => $bayAssignedAt,
                    'done_at'          => $doneAt,
                    'created_at'       => $createdAt,
                    'updated_at'       => $doneAt ?? $bayAssignedAt ?? $verifiedAt ?? $createdAt,
                ];

                $count++;

                // Batch insert every 500 records
                if (count($rows) >= 500) {
                    DoorsmeerBooking::insert($rows);
                    $rows = [];
                }
            }
        }

        if (!empty($rows)) {
            DoorsmeerBooking::insert($rows);
        }

        return $count;
    }

    // ── Bengkel Bookings ──────────────────────────────────────────────────────

    private function seedBengkelBookings(array $dates, array $customerIds, int $adminId): int
    {
        $count = 0;
        $rows = [];

        foreach ($dates as $date) {
            $isWeekend = $date->isWeekend();
            $isRecent  = $date->gte(Carbon::now()->subDays(2));
            $baseCount = rand(10, 18);
            $dailyCount = $isWeekend ? (int)($baseCount * 1.3) : $baseCount;

            for ($i = 0; $i < $dailyCount; $i++) {
                $service  = self::BENGKEL_SERVICES[array_rand(self::BENGKEL_SERVICES)];
                $isWalkin = rand(1, 100) <= 40; // 40% walk-in
                $userId   = $isWalkin ? $adminId : $customerIds[array_rand($customerIds)];
                $prefix   = $isWalkin ? 'WK' : 'BG';

                $status = $this->determineBookingStatus($date, $isRecent, 'servicing');
                $createdAt = $this->randomTimestamp($date, 8, 17);

                $verifiedAt = null;
                $bayAssignedAt = null;
                $doneAt = null;
                $stall = null;
                $adminNotes = $isWalkin
                    ? 'Walk-in Customer: ' . self::WALKIN_NAMES[array_rand(self::WALKIN_NAMES)]
                    : null;

                if (in_array($status, ['verified', 'in_queue', 'servicing', 'done'])) {
                    $verifiedAt = $createdAt->copy()->addMinutes(rand(3, 20));
                }
                if (in_array($status, ['servicing', 'done'])) {
                    $bayAssignedAt = ($verifiedAt ?? $createdAt)->copy()->addMinutes(rand(10, 60));
                    $stall = self::BENGKEL_STALLS[array_rand(self::BENGKEL_STALLS)];
                }
                if ($status === 'done') {
                    $doneAt = ($bayAssignedAt ?? $createdAt)->copy()->addMinutes(rand(15, 180));
                    $stall = null;
                }
                if ($status === 'cancelled') {
                    $adminNotes = $adminNotes ?: 'Pelanggan membatalkan';
                }

                $rows[] = [
                    'booking_code'     => $prefix . '-' . strtoupper(Str::random(5)),
                    'user_id'          => $userId,
                    'service_id'       => $service['id'],
                    'service_name'     => $service['name'],
                    'service_subtitle' => $service['subtitle'],
                    'service_price'    => $service['price'],
                    'service_duration' => $service['duration'],
                    'vehicle_class'    => self::VEHICLE_CLASSES[array_rand(self::VEHICLE_CLASSES)],
                    'license_plate'    => $this->randomPlate(),
                    'status'           => $status,
                    'stall'            => $stall,
                    'admin_notes'      => $adminNotes,
                    'verified_at'      => $verifiedAt,
                    'bay_assigned_at'  => $bayAssignedAt,
                    'done_at'          => $doneAt,
                    'created_at'       => $createdAt,
                    'updated_at'       => $doneAt ?? $bayAssignedAt ?? $verifiedAt ?? $createdAt,
                ];

                $count++;

                if (count($rows) >= 500) {
                    BengkelBooking::insert($rows);
                    $rows = [];
                }
            }
        }

        if (!empty($rows)) {
            BengkelBooking::insert($rows);
        }

        return $count;
    }

    // ── Rental PS Bookings ────────────────────────────────────────────────────

    private function seedRentalPsBookings(array $dates, array $customerIds, int $adminId): int
    {
        $count = 0;
        $rows = [];

        foreach ($dates as $date) {
            $isWeekend = $date->isWeekend();
            $isRecent  = $date->gte(Carbon::now()->subDays(2));
            $baseCount = rand(20, 35);
            $dailyCount = $isWeekend ? (int)($baseCount * 1.5) : $baseCount;

            for ($i = 0; $i < $dailyCount; $i++) {
                $service  = self::RENTAL_PS_SERVICES[array_rand(self::RENTAL_PS_SERVICES)];
                $isWalkin = rand(1, 100) <= 25; // 25% walk-in
                $userId   = $isWalkin ? $adminId : $customerIds[array_rand($customerIds)];
                $prefix   = $isWalkin ? 'WK' : 'PS';

                $duration = rand(1, 5); // 1-5 hours
                $totalPrice = $service['price'] * $duration;

                $status = $this->determineBookingStatus($date, $isRecent, 'playing');
                $createdAt = $this->randomTimestamp($date, 8, 23);

                $verifiedAt = null;
                $bayAssignedAt = null;
                $doneAt = null;
                $stall = null;
                $adminNotes = $isWalkin
                    ? 'Walk-in Customer: ' . self::WALKIN_NAMES[array_rand(self::WALKIN_NAMES)]
                    : null;

                if (in_array($status, ['verified', 'in_queue', 'playing', 'done'])) {
                    $verifiedAt = $createdAt->copy()->addMinutes(rand(1, 10));
                }
                if (in_array($status, ['playing', 'done'])) {
                    $bayAssignedAt = ($verifiedAt ?? $createdAt)->copy()->addMinutes(rand(2, 30));
                    $stall = self::RENTAL_STALLS[array_rand(self::RENTAL_STALLS)];
                }
                if ($status === 'done') {
                    $doneAt = ($bayAssignedAt ?? $createdAt)->copy()->addMinutes($duration * 60 + rand(-10, 15));
                    $stall = null;
                }
                if ($status === 'cancelled') {
                    $adminNotes = $adminNotes ?: 'Sesi dibatalkan';
                }

                $rows[] = [
                    'booking_code'     => $prefix . '-' . strtoupper(Str::random(5)),
                    'user_id'          => $userId,
                    'service_id'       => $service['id'],
                    'service_name'     => $service['name'],
                    'service_subtitle' => $service['subtitle'],
                    'service_price'    => $totalPrice,
                    'service_duration' => "{$duration} Jam",
                    'status'           => $status,
                    'stall'            => $stall,
                    'admin_notes'      => $adminNotes,
                    'verified_at'      => $verifiedAt,
                    'bay_assigned_at'  => $bayAssignedAt,
                    'done_at'          => $doneAt,
                    'created_at'       => $createdAt,
                    'updated_at'       => $doneAt ?? $bayAssignedAt ?? $verifiedAt ?? $createdAt,
                ];

                $count++;

                if (count($rows) >= 500) {
                    RentalPsBooking::insert($rows);
                    $rows = [];
                }
            }
        }

        if (!empty($rows)) {
            RentalPsBooking::insert($rows);
        }

        return $count;
    }

    // ── Store Orders (Coffee Shop / Vape Store) ──────────────────────────────

    private function seedStoreOrders(array $dates, array $customerIds, string $unit, string $codePrefix, int $minDaily, int $maxDaily): int
    {
        $count = 0;
        $products = Product::where('unit', $unit)->get();

        if ($products->isEmpty()) {
            $this->command->warn("  ⚠ No products found for {$unit}. Skipping store orders.");
            return 0;
        }

        foreach ($dates as $date) {
            $isWeekend = $date->isWeekend();
            $isRecent  = $date->gte(Carbon::now()->subDays(2));
            $baseCount = rand($minDaily, $maxDaily);
            $dailyCount = $isWeekend ? (int)($baseCount * 1.4) : $baseCount;

            for ($i = 0; $i < $dailyCount; $i++) {
                $customerId   = $customerIds[array_rand($customerIds)];
                $customerName = self::CUSTOMER_NAMES[array_rand(self::CUSTOMER_NAMES)];
                $paymentMethod = rand(1, 100) <= ($unit === 'COFFEE SHOP' ? 60 : 50) ? 'qris' : 'cash';

                // Generate 1-4 items per order (coffee) or 1-3 items (vape)
                $maxItems = $unit === 'COFFEE SHOP' ? 4 : 3;
                $itemCount = rand(1, $maxItems);
                $selectedProducts = $products->random(min($itemCount, $products->count()));
                
                $orderTotal = 0;
                $orderItems = [];

                foreach ($selectedProducts as $prod) {
                    $qty = rand(1, $unit === 'COFFEE SHOP' ? 3 : 2);
                    $itemTotal = $prod->price * $qty;
                    $orderTotal += $itemTotal;

                    $orderItems[] = [
                        'name'     => $prod->name,
                        'quantity' => $qty,
                        'price'    => $prod->price,
                    ];

                    // Track sold counts
                    $key = $prod->id;
                    $this->productSoldCounts[$key] = ($this->productSoldCounts[$key] ?? 0) + $qty;
                }

                // Determine status
                $status = 'BERHASIL';
                $progressStatus = 'completed';
                $doneAt = null;
                $adminNotes = null;
                $createdAt = $this->randomTimestamp($date, 8, $unit === 'COFFEE SHOP' ? 23 : 22);

                if ($isRecent) {
                    $roll = rand(1, 100);
                    if ($roll <= 12) {
                        $status = 'MENUNGGU PEMBAYARAN';
                        $progressStatus = 'menunggu_pembayaran';
                    } elseif ($roll <= 18) {
                        $status = 'MENUNGGU PEMBAYARAN';
                        $progressStatus = 'cancelled';
                        $adminNotes = 'Tidak ada pembayaran diterima';
                    } else {
                        $doneAt = $createdAt->copy()->addMinutes(rand(5, 30));
                    }
                } else {
                    $roll = rand(1, 100);
                    if ($roll <= 10) {
                        $status = 'MENUNGGU PEMBAYARAN';
                        $progressStatus = 'cancelled';
                        $adminNotes = 'Batal oleh pelanggan';
                    } else {
                        $doneAt = $createdAt->copy()->addMinutes(rand(5, 45));
                    }
                }

                // Create order
                $order = StoreOrder::create([
                    'user_id'         => $customerId,
                    'order_code'      => $codePrefix . '-' . strtoupper(Str::random(6)),
                    'customer_name'   => $customerName,
                    'unit'            => $unit,
                    'payment_method'  => $paymentMethod,
                    'total'           => $orderTotal,
                    'status'          => $status,
                    'progress_status' => $progressStatus,
                    'done_at'         => $doneAt,
                    'admin_notes'     => $adminNotes,
                    'created_at'      => $createdAt,
                    'updated_at'      => $doneAt ?? $createdAt,
                ]);

                // Create order items
                foreach ($orderItems as $item) {
                    StoreOrderItem::create([
                        'store_order_id' => $order->id,
                        'name'           => $item['name'],
                        'quantity'       => $item['quantity'],
                        'price'          => $item['price'],
                        'created_at'     => $createdAt,
                        'updated_at'     => $createdAt,
                    ]);
                }

                $count++;
            }
        }

        return $count;
    }

    // ── Update Product Stocks ─────────────────────────────────────────────────

    private function updateProductStocks(): void
    {
        foreach ($this->productSoldCounts as $productId => $soldCount) {
            $product = Product::find($productId);
            if ($product) {
                $product->update([
                    'sold'  => $product->sold + $soldCount,
                    'stock' => max(0, $product->stock - $soldCount),
                ]);
            }
        }
    }

    // ── Helper: Determine booking status based on date ────────────────────────

    private function determineBookingStatus(Carbon $date, bool $isRecent, string $activeStatus = 'washing'): string
    {
        if ($isRecent) {
            // Recent days: mix of active statuses
            $roll = rand(1, 100);
            if ($roll <= 35) return 'done';
            if ($roll <= 50) return 'pending';
            if ($roll <= 65) return 'verified';
            if ($roll <= 78) return 'in_queue';
            if ($roll <= 90) return $activeStatus;
            return 'cancelled';
        }

        // Historical: mostly done
        $roll = rand(1, 100);
        if ($roll <= 75) return 'done';
        if ($roll <= 85) return 'cancelled';
        if ($roll <= 92) return 'done'; // extra done to push ratio
        return 'done'; // force completed for old data
    }

    // ── Helper: Generate random timestamp within a day ─────────────────────────

    private function randomTimestamp(Carbon $date, int $openHour, int $closeHour): Carbon
    {
        // Create peak hours distribution
        $hour = $this->weightedRandomHour($openHour, $closeHour);
        $minute = rand(0, 59);
        $second = rand(0, 59);

        return $date->copy()->setTime($hour, $minute, $second);
    }

    /**
     * Generate weighted random hour — peak at 10-12 and 16-19
     */
    private function weightedRandomHour(int $open, int $close): int
    {
        $peakRanges = [[10, 12], [16, 19]];
        $isPeak = rand(1, 100) <= 45; // 45% chance of peak hour

        if ($isPeak) {
            $peakRange = $peakRanges[array_rand($peakRanges)];
            $hour = rand(max($open, $peakRange[0]), min($close - 1, $peakRange[1]));
        } else {
            $hour = rand($open, $close - 1);
        }

        return min($hour, $close - 1);
    }

    // ── Helper: Generate random license plate ─────────────────────────────────

    private function randomPlate(): string
    {
        $prefix = self::PLATE_PREFIXES[array_rand(self::PLATE_PREFIXES)];
        $number = rand(1000, 9999);
        $suffix = self::PLATE_SUFFIXES[array_rand(self::PLATE_SUFFIXES)];

        return "{$prefix} {$number} {$suffix}";
    }
}
