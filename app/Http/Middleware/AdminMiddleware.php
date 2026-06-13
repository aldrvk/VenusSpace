<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Daftar rute operasional per business_unit.
     * Rute yang hanya boleh diakses oleh admin/kasir unit terkait.
     */
    private array $unitRouteMap = [
        'doorsmeer' => ['admin.doorsmeer', 'admin.doorsmeer.'],
        'bengkel'   => ['admin.bengkel', 'admin.bengkel.'],
        'rental_ps' => ['admin.rentalps', 'admin.rental-ps.'],
        'vape_store' => ['admin.vape', 'admin.store.product', 'admin.store.display_settings', 'admin.store.categories', 'admin.store.walk-in'],
        'coffee_shop' => ['admin.coffee', 'admin.store.product', 'admin.store.display_settings', 'admin.store.categories', 'admin.store.walk-in'],
    ];

    /**
     * Rute operasional yang dilarang diakses oleh Owner.
     * Owner hanya bisa akses dashboard, laporan, dan pengaturan.
     */
    private array $ownerAllowedRoutes = [
        'admin.dashboard',
        'admin.laporan',
        'admin.laporan.export',
        'admin.pengaturan',
        'admin.settings.operational',
        'admin.settings.payment',
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect('/login');
        }

        $user = auth()->user();
        $role = $user->role;

        // 1. Hanya izinkan role admin, kasir, dan owner
        if (!in_array($role, ['admin', 'kasir', 'owner'])) {
            return redirect('/')->with('error', 'Anda tidak memiliki akses ke halaman admin.');
        }

        // 2. Owner: hanya boleh akses rute tertentu
        if ($role === 'owner') {
            $routeName = $request->route()->getName();
            if (!in_array($routeName, $this->ownerAllowedRoutes)) {
                return redirect()->route('admin.dashboard')
                    ->with('error', 'Owner tidak memiliki akses ke halaman operasional.');
            }
        }

        // 3. Admin/Kasir: batasi akses ke rute unit usaha lain
        if (in_array($role, ['admin', 'kasir'])) {
            $routeName = $request->route()->getName();
            $businessUnit = $user->business_unit;

            // Rute umum yang boleh diakses semua admin/kasir
            $commonRoutes = [
                'admin.dashboard',
                'admin.laporan',
                'admin.laporan.export',
                'admin.pengaturan',
                'admin.settings.operational',
                'admin.settings.payment',
                'admin.jadwal',
            ];

            if (!in_array($routeName, $commonRoutes)) {
                // Cek apakah rute ini milik unit lain
                $isAllowed = false;
                
                if (isset($this->unitRouteMap[$businessUnit])) {
                    foreach ($this->unitRouteMap[$businessUnit] as $prefix) {
                        if ($routeName === $prefix || str_starts_with($routeName, $prefix)) {
                            $isAllowed = true;
                            break;
                        }
                    }
                }

                // Kasir juga boleh akses pesanan store
                if (in_array($businessUnit, ['vape_store', 'coffee_shop'])) {
                    if (in_array($routeName, ['admin.pesanan-store', 'admin.store.order.confirm', 'admin.store.order.progress', 'admin.store.order.cancel'])) {
                        $isAllowed = true;
                    }
                }

                if (!$isAllowed) {
                    return redirect()->route('admin.dashboard')
                        ->with('error', 'Anda tidak memiliki akses ke halaman unit usaha lain.');
                }
            }
        }

        return $next($request);
    }
}
