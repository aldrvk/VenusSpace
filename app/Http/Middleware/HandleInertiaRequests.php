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
            ],
            'settings' => fn () => $this->getOperationalSettings(),
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

    private function getPendingCount(): int
    {
        try {
            $doorsmeer = \App\Models\DoorsmeerBooking::whereNotIn('status', ['done', 'cancelled'])->count();
            $bengkel = \App\Models\BengkelBooking::whereNotIn('status', ['done', 'cancelled'])->count();
            $rental = \App\Models\RentalPsBooking::whereNotIn('status', ['done', 'cancelled'])->count();
            $store = \App\Models\StoreOrder::whereNotIn('status', ['BERHASIL', 'BATAL'])->count();
            return $doorsmeer + $bengkel + $rental + $store;
        } catch (\Exception $e) {
            return 0;
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
