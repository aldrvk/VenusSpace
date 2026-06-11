<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $role = $user?->role;
        $unit = $user?->business_unit;
        $isStaff = in_array($role, ['admin', 'kasir', 'owner']);

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'otp_sent' => fn () => $request->session()->get('otp_sent'),
                'otp_email' => fn () => $request->session()->get('otp_email'),
                'otp_remember' => fn () => $request->session()->get('otp_remember'),
            ],
            'notifications' => [
                'pendingCount' => fn () => $this->getPendingCountForUnit($role, $unit),
                'doorsmeerCount' => fn () => $this->getDoorsmeerCount(),
                'bengkelCount' => fn () => $this->getBengkelCount(),
                'rentalCount' => fn () => $this->getRentalCount(),
                'storeCount' => fn () => $this->getStoreCount(),
                'pendingItems' => fn () => $isStaff ? $this->getPendingItemsForUnit($role, $unit) : [],
            ],
            'settings' => fn () => $this->getOperationalSettings(),
            'display_settings' => fn () => [
                'show_stock_coffee_shop' => (bool) \App\Models\Setting::get('show_stock_coffee_shop', false),
                'show_stock_vape_store'  => (bool) \App\Models\Setting::get('show_stock_vape_store', false),
            ],
            'payment_settings' => function () use ($request, $isStaff) {
                $settings = \App\Models\Setting::get('payment_settings', []);
                if ($isStaff) {
                    return $settings;
                }
                // Exclude sensitive keys for public/customers
                return collect($settings)->except(['midtrans_server_key'])->toArray();
            },
        ];
    }

    private function getDoorsmeerCount(): int
    {
        try {
            return \App\Models\DoorsmeerBooking::whereNotIn('status', ['done', 'cancelled'])->count();
        } catch (\Exception $e) { return 0; }
    }

    private function getBengkelCount(): int
    {
        try {
            return \App\Models\BengkelBooking::whereNotIn('status', ['done', 'cancelled'])->count();
        } catch (\Exception $e) { return 0; }
    }

    private function getRentalCount(): int
    {
        try {
            return \App\Models\RentalPsBooking::whereNotIn('status', ['done', 'cancelled'])->count();
        } catch (\Exception $e) { return 0; }
    }

    private function getStoreCount(): int
    {
        try {
            return \App\Models\StoreOrder::whereNotIn('progress_status', ['completed', 'cancelled'])->count();
        } catch (\Exception $e) { return 0; }
    }

    private function getPendingCount(): int
    {
        return $this->getDoorsmeerCount() + $this->getBengkelCount() + $this->getRentalCount() + $this->getStoreCount();
    }

    /**
     * Hitung pending count yang relevan berdasarkan role & business_unit.
     */
    private function getPendingCountForUnit(?string $role, ?string $unit): int
    {
        if ($role === 'owner') {
            return $this->getPendingCount();
        }

        return match ($unit) {
            'doorsmeer' => $this->getDoorsmeerCount(),
            'bengkel' => $this->getBengkelCount(),
            'rental_ps' => $this->getRentalCount(),
            'vape_store', 'coffee_shop' => $this->getStoreCount(),
            default => $this->getPendingCount(),
        };
    }

    private function getPendingItems(): array
    {
        return $this->getPendingItemsForUnit(null, null);
    }

    /**
     * Ambil pending items yang relevan berdasarkan role & business_unit.
     */
    private function getPendingItemsForUnit(?string $role, ?string $unit): array
    {
        try {
            $list = [];
            $showBooking = $role === 'owner' || $unit === null || in_array($unit, ['doorsmeer', 'bengkel', 'rental_ps']);
            $showStore = $role === 'owner' || $unit === null || in_array($unit, ['vape_store', 'coffee_shop']);

            // 1. Doorsmeer Bookings
            if ($showBooking && ($role === 'owner' || $unit === null || $unit === 'doorsmeer')) {
                $doorsmeer = \App\Models\DoorsmeerBooking::where('status', 'pending')
                    ->orderBy('created_at', 'desc')
                    ->get()
                    ->map(function ($b) {
                        return [
                            'id' => 'doorsmeer-' . $b->id,
                            'code' => $b->booking_code,
                            'title' => 'Booking Doorsmeer Baru',
                            'customer' => $b->customer_name,
                            'detail' => $b->vehicle_class . ' · ' . $b->license_plate,
                            'time' => $b->created_at->diffForHumans(),
                            'timestamp' => $b->created_at->timestamp,
                            'link' => '/admin/booking-doorsmeer?search=' . urlencode($b->booking_code),
                            'type' => 'doorsmeer',
                        ];
                    });
                foreach ($doorsmeer as $item) $list[] = $item;
            }

            // 2. Bengkel Bookings
            if ($showBooking && ($role === 'owner' || $unit === null || $unit === 'bengkel')) {
                $bengkel = \App\Models\BengkelBooking::where('status', 'pending')
                    ->orderBy('created_at', 'desc')
                    ->get()
                    ->map(function ($b) {
                        return [
                            'id' => 'bengkel-' . $b->id,
                            'code' => $b->booking_code,
                            'title' => 'Booking Bengkel Baru',
                            'customer' => $b->customer_name,
                            'detail' => $b->vehicle_class . ' · ' . $b->license_plate,
                            'time' => $b->created_at->diffForHumans(),
                            'timestamp' => $b->created_at->timestamp,
                            'link' => '/admin/booking-bengkel?search=' . urlencode($b->booking_code),
                            'type' => 'bengkel',
                        ];
                    });
                foreach ($bengkel as $item) $list[] = $item;
            }

            // 3. Rental PS Bookings
            if ($showBooking && ($role === 'owner' || $unit === null || $unit === 'rental_ps')) {
                $rental = \App\Models\RentalPsBooking::where('status', 'pending')
                    ->orderBy('created_at', 'desc')
                    ->get()
                    ->map(function ($b) {
                        return [
                            'id' => 'rental-' . $b->id,
                            'code' => $b->booking_code,
                            'title' => 'Booking Rental PS Baru',
                            'customer' => $b->customer_name,
                            'detail' => $b->service_name . ' · ' . $b->service_duration,
                            'time' => $b->created_at->diffForHumans(),
                            'timestamp' => $b->created_at->timestamp,
                            'link' => '/admin/booking-rental-ps?search=' . urlencode($b->booking_code),
                            'type' => 'rental_ps',
                        ];
                    });
                foreach ($rental as $item) $list[] = $item;
            }

            // 4. Store Orders
            if ($showStore) {
                $storeQuery = \App\Models\StoreOrder::whereIn('progress_status', ['menunggu_pembayaran', 'pending'])
                    ->orderBy('created_at', 'desc');

                // Filter per unit toko untuk kasir
                if ($unit === 'vape_store') {
                    $storeQuery->where('unit', 'VAPE STORE');
                } elseif ($unit === 'coffee_shop') {
                    $storeQuery->where('unit', 'COFFEE SHOP');
                }

                $store = $storeQuery->get()
                    ->map(function ($o) {
                        $unitLabel = $o->unit === 'VAPE STORE' ? 'Vape Store' : 'Coffee Shop';
                        $paymentLabel = strtolower($o->payment_method) === 'qris' ? 'Pembayaran Online' : strtoupper($o->payment_method);
                        return [
                            'id' => 'store-' . $o->id,
                            'code' => $o->order_code ?? (string)$o->id,
                            'title' => 'Pesanan ' . $unitLabel . ' Baru',
                            'customer' => $o->customer_name,
                            'detail' => 'Rp' . number_format($o->total, 0, ',', '.') . ' (' . $paymentLabel . ')',
                            'time' => $o->created_at ? $o->created_at->diffForHumans() : '',
                            'timestamp' => $o->created_at ? $o->created_at->timestamp : 0,
                            'link' => '/admin/pesanan-store?search=' . urlencode($o->order_code ?? (string)$o->id),
                            'type' => 'store',
                        ];
                    });
                foreach ($store as $item) $list[] = $item;
            }

            // Urutkan berdasarkan waktu terbaru
            usort($list, function ($a, $b) {
                return $b['timestamp'] <=> $a['timestamp'];
            });

            // Ambil maksimal 15 notifikasi terbaru
            return array_slice($list, 0, 15);
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Safely retrieve operational settings, returning empty array if table doesn't exist.
     */
    private function getOperationalSettings(): array
    {
        try {
            return \App\Models\Setting::get('operational_settings', []) ?? [];
        } catch (\Exception $e) {
            return [];
        }
    }
}
