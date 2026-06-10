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
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
            'notifications' => [
                'pendingCount' => fn () => $this->getPendingCount(),
                'doorsmeerCount' => fn () => $this->getDoorsmeerCount(),
                'bengkelCount' => fn () => $this->getBengkelCount(),
                'rentalCount' => fn () => $this->getRentalCount(),
                'storeCount' => fn () => $this->getStoreCount(),
                'pendingItems' => fn () => ($request->user() && $request->user()->role === 'admin') ? $this->getPendingItems() : [],
            ],
            'settings' => fn () => $this->getOperationalSettings(),
            'display_settings' => fn () => [
                'show_stock_coffee_shop' => (bool) \App\Models\Setting::get('show_stock_coffee_shop', false),
                'show_stock_vape_store'  => (bool) \App\Models\Setting::get('show_stock_vape_store', false),
            ],
            'payment_settings' => function () use ($request) {
                $settings = \App\Models\Setting::get('payment_settings', []);
                if ($request->user() && $request->user()->role === 'admin') {
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

    private function getPendingItems(): array
    {
        try {
            $list = [];

            // 1. Doorsmeer Bookings (Menunggu Konfirmasi)
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

            // 2. Bengkel Bookings (Menunggu Konfirmasi)
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

            // 3. Rental PS Bookings (Menunggu Konfirmasi)
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

            // 4. Store Orders (Menunggu Pembayaran / Diterima)
            $store = \App\Models\StoreOrder::whereIn('progress_status', ['menunggu_pembayaran', 'pending'])
                ->orderBy('created_at', 'desc')
                ->get()
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
