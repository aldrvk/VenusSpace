<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DoorsmeerBooking;
use App\Models\BengkelBooking;
use App\Models\RentalPsBooking;
use App\Models\StoreOrder;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->query('period', 'Hari Ini');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $user = auth()->user();
        
        $data = $this->getReportData($period, $user->role, $user->business_unit, $startDate, $endDate);

        return Inertia::render('Admin/Laporan', [
            'initialTransactions'  => $data['allTransactions'],
            'initialRevenueByUnit' => $data['revenueByUnit'],
            'initialPeriod'        => $period,
            'kpi'                  => $data['kpi'],
            'chartData'            => $data['chartData'],
            'filters'              => [
                'start_date' => $startDate,
                'end_date'   => $endDate,
            ]
        ]);
    }

    public function exportPdf(Request $request)
    {
        $period = $request->query('period', 'Hari Ini');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $user = auth()->user();
        
        $data = $this->getReportData($period, $user->role, $user->business_unit, $startDate, $endDate);
        $data['period'] = $period;
        $data['start_date'] = $startDate;
        $data['end_date'] = $endDate;
        $data['date_generated'] = now()->format('d F Y H:i');

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('admin.reports.pdf', $data);
        return $pdf->download('Laporan_Venus_Space_' . str_replace(' ', '_', $period) . '.pdf');
    }

    private function getReportData($period, $role = null, $unit = null, $startDateStr = null, $endDateStr = null)
    {
        if ($startDateStr && $endDateStr) {
            $startDate = Carbon::parse($startDateStr)->startOfDay();
            $endDate = Carbon::parse($endDateStr)->endOfDay();
        } else {
            $startDate = match ($period) {
                'Minggu Ini' => Carbon::now()->startOfWeek(),
                'Bulan Ini'  => Carbon::now()->startOfMonth(),
                default      => Carbon::now()->startOfDay(),
            };
            $endDate = Carbon::now()->endOfDay();
        }

        $showDoorsmeer = $role === 'owner' || $unit === 'doorsmeer' || $unit === null;
        $showBengkel = $role === 'owner' || $unit === 'bengkel' || $unit === null;
        $showRental = $role === 'owner' || $unit === 'rental_ps' || $unit === null;
        $showVape = $role === 'owner' || $unit === 'vape_store' || $unit === null;
        $showCoffee = $role === 'owner' || $unit === 'coffee_shop' || $unit === null;

        // 1. Fetch Doorsmeer
        $doorsmeer = $showDoorsmeer
            ? DoorsmeerBooking::with('user')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->get()->map(function($item) {
                    return [
                        'id' => $item->booking_code,
                        'time' => $item->created_at->format('H:i'),
                        'date' => $item->created_at->format('d/m/Y'),
                        'customer' => $item->booking_type === 'walkin' ? $item->walkin_name : ($item->user ? $item->user->name : 'Unknown'),
                        'unit' => 'Doorsmeer',
                        'service' => $item->service_name,
                        'amount' => $item->service_price,
                        'status' => $item->status === 'done' ? 'Lunas' : ($item->status === 'cancelled' ? 'Batal' : 'Pending'),
                        'created_at' => $item->created_at,
                    ];
                })
            : collect();

        // 2. Fetch Bengkel
        $bengkel = $showBengkel
            ? BengkelBooking::with('user')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->get()->map(function($item) {
                    return [
                        'id' => $item->booking_code,
                        'time' => $item->created_at->format('H:i'),
                        'date' => $item->created_at->format('d/m/Y'),
                        'customer' => $item->booking_type === 'walkin' ? $item->walkin_name : ($item->user ? $item->user->name : 'Unknown'),
                        'unit' => 'Bengkel',
                        'service' => $item->service_name,
                        'amount' => $item->service_price,
                        'status' => $item->status === 'done' ? 'Lunas' : ($item->status === 'cancelled' ? 'Batal' : 'Pending'),
                        'created_at' => $item->created_at,
                    ];
                })
            : collect();

        // 3. Fetch Rental PS
        $rental = $showRental
            ? RentalPsBooking::with('user')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->get()->map(function($item) {
                    return [
                        'id' => $item->booking_code,
                        'time' => $item->created_at->format('H:i'),
                        'date' => $item->created_at->format('d/m/Y'),
                        'customer' => $item->booking_type === 'walkin' ? $item->walkin_name : ($item->user ? $item->user->name : 'Unknown'),
                        'unit' => 'Rental PS',
                        'service' => $item->service_name,
                        'amount' => $item->service_price,
                        'status' => $item->status === 'done' ? 'Lunas' : ($item->status === 'cancelled' ? 'Batal' : 'Pending'),
                        'created_at' => $item->created_at,
                    ];
                })
            : collect();

        // 4. Fetch Store Orders (Coffee Shop & Vape Store)
        $storeQuery = StoreOrder::with('items')
            ->whereBetween('created_at', [$startDate, $endDate]);
        
        if ($unit === 'vape_store') {
            $storeQuery->where('unit', 'VAPE STORE');
        } elseif ($unit === 'coffee_shop') {
            $storeQuery->where('unit', 'COFFEE SHOP');
        } elseif (!$showVape && !$showCoffee) {
            $storeQuery->whereRaw('1 = 0');
        }

        $storeOrders = $storeQuery->get()->map(function($item) {
                $serviceName = 'Pesanan';
                if ($item->items && $item->items->count() > 0) {
                    $firstItem = $item->items->first();
                    $serviceName = $firstItem->product_name . ($item->items->count() > 1 ? ' + lainnya' : ' x ' . $firstItem->quantity);
                }
                
                return [
                    'id' => $item->order_code,
                    'time' => $item->created_at->format('H:i'),
                    'date' => $item->created_at ? $item->created_at->format('d/m/Y') : '',
                    'customer' => $item->customer_name ?? 'Unknown',
                    'unit' => $item->unit === 'VAPE STORE' ? 'Vape Store' : 'Coffee Shop',
                    'service' => $serviceName,
                    'amount' => $item->total,
                    'status' => ($item->status === 'BERHASIL' || $item->progress_status === 'completed') ? 'Lunas' : ($item->status === 'BATAL' || $item->progress_status === 'cancelled' ? 'Batal' : 'Pending'),
                    'created_at' => $item->created_at,
                ];
            });

        $allTransactions = collect()
            ->concat($doorsmeer)
            ->concat($bengkel)
            ->concat($rental)
            ->concat($storeOrders)
            ->sortByDesc('created_at')
            ->values()
            ->map(function($item) {
                unset($item['created_at']);
                return $item;
            });

        // Aggregate Revenue by Unit
        $lunasTransactions = collect()
            ->concat($doorsmeer)
            ->concat($bengkel)
            ->concat($rental)
            ->concat($storeOrders)
            ->filter(fn($item) => $item['status'] === 'Lunas');

        $totalRevenue = $lunasTransactions->sum('amount');
        
        $revenueByUnit = [];
        $units = ['Doorsmeer', 'Bengkel', 'Coffee Shop', 'Rental PS', 'Vape Store'];
        
        // Saring unit usaha berdasarkan role & unit user
        if ($role !== 'owner' && $unit !== null) {
            $userUnitLabel = match ($unit) {
                'doorsmeer' => 'Doorsmeer',
                'bengkel' => 'Bengkel',
                'rental_ps' => 'Rental PS',
                'vape_store' => 'Vape Store',
                'coffee_shop' => 'Coffee Shop',
                default => null
            };
            if ($userUnitLabel) {
                $units = [$userUnitLabel];
            }
        }

        $colors = [
            'Doorsmeer' => 'bg-primary',
            'Bengkel' => 'bg-orange-400',
            'Coffee Shop' => 'bg-amber-400',
            'Rental PS' => 'bg-purple-400',
            'Vape Store' => 'bg-indigo-400'
        ];

        foreach ($units as $u) {
            $unitTx = $lunasTransactions->where('unit', $u);
            $amount = $unitTx->sum('amount');
            
            $unitAllTx = collect()
                ->concat($doorsmeer)
                ->concat($bengkel)
                ->concat($rental)
                ->concat($storeOrders)
                ->where('unit', $u);
                
            $bookings = $unitAllTx->count();
            
            if ($bookings > 0 || in_array($u, ['Doorsmeer', 'Bengkel', 'Coffee Shop', 'Rental PS'])) {
                $revenueByUnit[] = [
                    'unit' => $u,
                    'amount' => $amount,
                    'bookings' => $bookings,
                    'pct' => $totalRevenue > 0 ? round(($amount / $totalRevenue) * 100) : 0,
                    'color' => $colors[$u] ?? 'bg-gray-400'
                ];
            }
        }
        
        $pendingTransactions = collect()
            ->concat($doorsmeer)
            ->concat($bengkel)
            ->concat($rental)
            ->concat($storeOrders)
            ->filter(fn($item) => $item['status'] === 'Pending');
            
        $kpi = [
            'totalRevenue' => $totalRevenue,
            'totalBookings' => collect()
                ->concat($doorsmeer)
                ->concat($bengkel)
                ->concat($rental)
                ->concat($storeOrders)
                ->count(),
            'pendingAmount' => $pendingTransactions->sum('amount'),
            'pendingCount' => $pendingTransactions->count(),
        ];

        $chartData = [];
        // Jika beda tanggal lebih dari 1 hari, tampilkan per hari. Jika hari yang sama, tampilkan per jam.
        $diffDays = $startDate->diffInDays($endDate);

        if ($diffDays <= 1) {
            for ($i = 8; $i <= 22; $i++) {
                $hour = str_pad($i, 2, '0', STR_PAD_LEFT);
                $count = collect()
                    ->concat($doorsmeer)->concat($bengkel)->concat($rental)->concat($storeOrders)
                    ->filter(function($item) use ($hour) {
                        return Carbon::parse($item['created_at'])->format('H') == $hour;
                    })->count();
                $chartData[] = ['label' => $hour . ':00', 'value' => $count];
            }
        } else {
            $current = $startDate->copy();
            while ($current <= $endDate) {
                $dateStr = $current->format('d/m');
                $dayStr = $current->format('Y-m-d');
                $count = collect()
                    ->concat($doorsmeer)->concat($bengkel)->concat($rental)->concat($storeOrders)
                    ->filter(function($item) use ($dayStr) {
                        return Carbon::parse($item['created_at'])->format('Y-m-d') == $dayStr;
                    })->count();
                $chartData[] = ['label' => $dateStr, 'value' => $count];
                $current->addDay();
            }
        }

        return [
            'allTransactions' => $allTransactions,
            'revenueByUnit'   => array_values($revenueByUnit),
            'kpi'             => $kpi,
            'chartData'       => $chartData
        ];
    }
}
