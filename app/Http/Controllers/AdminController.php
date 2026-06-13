<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DoorsmeerBooking;
use App\Models\BengkelBooking;
use App\Models\RentalPsBooking;
use App\Models\StoreOrder;
use App\Models\User;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        $role = $user->role;
        $unit = $user->business_unit;

        $todayStart = Carbon::now()->startOfDay();
        $todayEnd = Carbon::now()->endOfDay();
        $yesterdayStart = Carbon::now()->subDay()->startOfDay();
        $yesterdayEnd = Carbon::now()->subDay()->endOfDay();

        // Tentukan data apa saja yang dimuat berdasarkan role & unit
        $showDoorsmeer = $role === 'owner' || $unit === 'doorsmeer';
        $showBengkel = $role === 'owner' || $unit === 'bengkel';
        $showRental = $role === 'owner' || $unit === 'rental_ps';
        $showVape = $role === 'owner' || $unit === 'vape_store';
        $showCoffee = $role === 'owner' || $unit === 'coffee_shop';
        $showStore = $showVape || $showCoffee;

        // 1. Fetch Doorsmeer
        $doorsmeer = $showDoorsmeer
            ? DoorsmeerBooking::with('user')->whereBetween('created_at', [$todayStart, $todayEnd])->get()
            : collect();
            
        // 2. Fetch Bengkel
        $bengkel = $showBengkel
            ? BengkelBooking::with('user')->whereBetween('created_at', [$todayStart, $todayEnd])->get()
            : collect();
            
        // 3. Fetch Rental PS
        $rental = $showRental
            ? RentalPsBooking::with('user')->whereBetween('created_at', [$todayStart, $todayEnd])->get()
            : collect();
            
        // 4. Fetch Store Orders (filter by unit for kasir)
        $storeQuery = StoreOrder::with('items')->whereBetween('created_at', [$todayStart, $todayEnd]);
        if ($unit === 'vape_store') {
            $storeQuery->where('unit', 'VAPE STORE');
        } elseif ($unit === 'coffee_shop') {
            $storeQuery->where('unit', 'COFFEE SHOP');
        } elseif (!$showStore) {
            $storeQuery->whereRaw('1 = 0'); // empty result for booking admin
        }
        $storeOrders = $storeQuery->get();

        // Calculate Stats
        $allBookings = collect()
            ->concat($doorsmeer)
            ->concat($bengkel)
            ->concat($rental)
            ->concat($storeOrders);

        $totalBooking = $allBookings->count();
        
        $pendingCount = collect()
            ->concat($doorsmeer->whereNotIn('status', ['done', 'cancelled']))
            ->concat($bengkel->whereNotIn('status', ['done', 'cancelled']))
            ->concat($rental->whereNotIn('status', ['done', 'cancelled']))
            ->concat($storeOrders->whereNotIn('status', ['BERHASIL', 'BATAL']))
            ->count();
            
        $completedCount = collect()
            ->concat($doorsmeer->where('status', 'done'))
            ->concat($bengkel->where('status', 'done'))
            ->concat($rental->where('status', 'done'))
            ->concat($storeOrders->where('status', 'BERHASIL'))
            ->count();

        $revenueToday = collect()
            ->concat($doorsmeer->where('status', 'done')->map(fn($i) => $i->service_price))
            ->concat($bengkel->where('status', 'done')->map(fn($i) => $i->service_price))
            ->concat($rental->where('status', 'done')->map(fn($i) => $i->service_price))
            ->concat($storeOrders->where('status', 'BERHASIL')->map(fn($i) => $i->total))
            ->sum();

        // 5. Overall Totals (All Time) — scoped by unit
        $totalAllTime = 0;
        $revenueAllTime = 0;

        if ($showDoorsmeer) {
            $totalAllTime += DoorsmeerBooking::count();
            $revenueAllTime += DoorsmeerBooking::where('status', 'done')->sum('service_price');
        }
        if ($showBengkel) {
            $totalAllTime += BengkelBooking::count();
            $revenueAllTime += BengkelBooking::where('status', 'done')->sum('service_price');
        }
        if ($showRental) {
            $totalAllTime += RentalPsBooking::count();
            $revenueAllTime += RentalPsBooking::where('status', 'done')->sum('service_price');
        }
        if ($showStore) {
            $storeAllTimeQuery = StoreOrder::query();
            $storeRevenueQuery = StoreOrder::where('status', 'BERHASIL');
            if ($unit === 'vape_store') {
                $storeAllTimeQuery->where('unit', 'VAPE STORE');
                $storeRevenueQuery->where('unit', 'VAPE STORE');
            } elseif ($unit === 'coffee_shop') {
                $storeAllTimeQuery->where('unit', 'COFFEE SHOP');
                $storeRevenueQuery->where('unit', 'COFFEE SHOP');
            }
            $totalAllTime += $storeAllTimeQuery->count();
            $revenueAllTime += $storeRevenueQuery->sum('total');
        }

        // ── Owner-specific: Revenue per unit today ────────────────────────────────
        $unitPerformance = [];
        if ($role === 'owner') {
            $unitConfigs = [
                ['key' => 'doorsmeer', 'label' => 'Doorsmeer', 'color' => 'primary',
                 'todayTx' => $doorsmeer, 'model' => DoorsmeerBooking::class, 'priceField' => 'service_price', 'doneStatus' => 'done'],
                ['key' => 'bengkel', 'label' => 'Bengkel', 'color' => 'orange',
                 'todayTx' => $bengkel, 'model' => BengkelBooking::class, 'priceField' => 'service_price', 'doneStatus' => 'done'],
                ['key' => 'rental_ps', 'label' => 'Rental PS', 'color' => 'purple',
                 'todayTx' => $rental, 'model' => RentalPsBooking::class, 'priceField' => 'service_price', 'doneStatus' => 'done'],
            ];

            foreach ($unitConfigs as $uc) {
                $todayRevenue = $uc['todayTx']->where('status', $uc['doneStatus'])->sum($uc['priceField']);
                $todayTotal = $uc['todayTx']->count();
                $todayPending = $uc['todayTx']->whereNotIn('status', [$uc['doneStatus'], 'cancelled'])->count();
                
                $unitPerformance[] = [
                    'key' => $uc['key'],
                    'label' => $uc['label'],
                    'color' => $uc['color'],
                    'revenueToday' => $todayRevenue,
                    'totalToday' => $todayTotal,
                    'pendingToday' => $todayPending,
                    'completedToday' => $uc['todayTx']->where('status', $uc['doneStatus'])->count(),
                ];
            }

            // Store units (Vape + Coffee)
            foreach (['VAPE STORE' => ['vape_store', 'Vape Store', 'indigo'], 'COFFEE SHOP' => ['coffee_shop', 'Coffee Shop', 'amber']] as $storeUnit => [$key, $label, $color]) {
                $storeTx = $storeOrders->where('unit', $storeUnit);
                $unitPerformance[] = [
                    'key' => $key,
                    'label' => $label,
                    'color' => $color,
                    'revenueToday' => $storeTx->where('status', 'BERHASIL')->sum('total'),
                    'totalToday' => $storeTx->count(),
                    'pendingToday' => $storeTx->whereNotIn('status', ['BERHASIL', 'BATAL'])->count(),
                    'completedToday' => $storeTx->where('status', 'BERHASIL')->count(),
                ];
            }

            // Yesterday comparison
            $revenueYesterday = 0;
            $revenueYesterday += DoorsmeerBooking::where('status', 'done')->whereBetween('created_at', [$yesterdayStart, $yesterdayEnd])->sum('service_price');
            $revenueYesterday += BengkelBooking::where('status', 'done')->whereBetween('created_at', [$yesterdayStart, $yesterdayEnd])->sum('service_price');
            $revenueYesterday += RentalPsBooking::where('status', 'done')->whereBetween('created_at', [$yesterdayStart, $yesterdayEnd])->sum('service_price');
            $revenueYesterday += StoreOrder::where('status', 'BERHASIL')->whereBetween('created_at', [$yesterdayStart, $yesterdayEnd])->sum('total');
        }

        // Recent Bookings — scoped by unit
        $recent = collect()

        if ($showDoorsmeer) {
            $recentDoorsmeer = DoorsmeerBooking::with('user')->latest()->limit(10)->get();
            $recent = $recent->concat($recentDoorsmeer->map(function($item) {
                return [
                    'id' => $item->id,
                    'customer' => $item->booking_type === 'walk_in' ? $item->walkin_name : ($item->user ? $item->user->name : 'Unknown'),
                    'service' => $item->service_name,
                    'unit' => 'DOORSMEER',
                    'time' => $item->created_at->format('H:i'),
                    'status' => $item->status === 'done' ? 'SELESAI' : ($item->status === 'cancelled' ? 'BATAL' : 'PENDING'),
                    'created_at' => $item->created_at,
                ];
            }));
        }

        if ($showBengkel) {
            $recentBengkel = BengkelBooking::with('user')->latest()->limit(10)->get();
            $recent = $recent->concat($recentBengkel->map(function($item) {
                return [
                    'id' => $item->id,
                    'customer' => $item->booking_type === 'walk_in' ? $item->walkin_name : ($item->user ? $item->user->name : 'Unknown'),
                    'service' => $item->service_name,
                    'unit' => 'BENGKEL',
                    'time' => $item->created_at->format('H:i'),
                    'status' => $item->status === 'done' ? 'SELESAI' : ($item->status === 'cancelled' ? 'BATAL' : 'PENDING'),
                    'created_at' => $item->created_at,
                ];
            }));
        }

        if ($showRental) {
            $recentRental = RentalPsBooking::with('user')->latest()->limit(10)->get();
            $recent = $recent->concat($recentRental->map(function($item) {
                return [
                    'id' => $item->id,
                    'customer' => $item->booking_type === 'walk_in' ? $item->walkin_name : ($item->user ? $item->user->name : 'Unknown'),
                    'service' => $item->service_name,
                    'unit' => 'RENTAL PS',
                    'time' => $item->created_at->format('H:i'),
                    'status' => $item->status === 'done' ? 'SELESAI' : ($item->status === 'cancelled' ? 'BATAL' : 'PENDING'),
                    'created_at' => $item->created_at,
                ];
            }));
        }

        if ($showStore) {
            $storeRecentQuery = StoreOrder::with('items')->latest()->limit(10);
            if ($unit === 'vape_store') {
                $storeRecentQuery->where('unit', 'VAPE STORE');
            } elseif ($unit === 'coffee_shop') {
                $storeRecentQuery->where('unit', 'COFFEE SHOP');
            }
            $recentStore = $storeRecentQuery->get();
            $recent = $recent->concat($recentStore->map(function($item) {
                $serviceName = 'Pesanan';
                if ($item->items && $item->items->count() > 0) {
    
                    $firstItem = $item->items->first();
                    $serviceName = $firstItem->quantity . 'x ' . $firstItem->name;
                    
                    $sisaItem = $item->items->count() - 1;
                    if ($sisaItem > 0) {
                        $serviceName .= " (+ $sisaItem item lainnya)";
                    }
                }
                return [
                    'id' => $item->id,
                    'customer' => $item->customer_name ?? 'Unknown',
                    'service' => $serviceName,
                    'unit' => $item->unit ?? 'COFFEE SHOP',
                    'time' => $item->created_at->format('H:i'),
                    'status' => $item->progress_status === 'cancelled' ? 'BATAL' : ($item->progress_status === 'completed' ? 'SELESAI' : (in_array($item->progress_status, ['pending', 'processing', 'ready']) ? 'IN PROGRESS' : 'PENDING')),
                    'created_at' => $item->created_at,
                ];
            }));
        }

        $recent = $recent
            ->sortByDesc('created_at')
            ->take(10)
            ->values();

        // Label berdasarkan role
        $roleLabel = match ($role) {
            'owner' => 'Pemilik',
            'kasir' => 'Kasir',
            default => 'Admin',
        };

        $unitLabel = match ($unit) {
            'doorsmeer' => 'Doorsmeer',
            'bengkel' => 'Bengkel',
            'rental_ps' => 'Rental PS',
            'vape_store' => 'Vape Store',
            'coffee_shop' => 'Coffee Shop',
            default => 'Venus Hub',
        };

        // Employee count for owner
        $employeeCount = $role === 'owner' ? User::whereIn('role', ['admin', 'kasir'])->where('employee_status', 'active')->count() : 0;

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalToday' => $totalBooking,
                'pendingToday' => $pendingCount,
                'completedToday' => $completedCount,
                'revenueToday' => $revenueToday,
                'totalAllTime' => $totalAllTime,
                'revenueAllTime' => $revenueAllTime,
                'revenueYesterday' => $revenueYesterday ?? 0,
                'completionRate' => $totalBooking > 0 ? round(($completedCount / $totalBooking) * 100) : 0,
            ],
            'unitPerformance' => $unitPerformance,
            'employeeCount' => $employeeCount,
            'recentBookings' => $recent,
            'roleInfo' => [
                'role' => $role,
                'roleLabel' => $roleLabel,
                'unit' => $unit,
                'unitLabel' => $unitLabel,
                'userName' => $user->name,
            ],
        ]);
    }
}
