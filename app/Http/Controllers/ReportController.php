<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DoorsmeerBooking;
use App\Models\BengkelBooking;
use App\Models\RentalPsBooking;
use App\Models\StoreOrder;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Exports\LaporanExport;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->query('period', 'Hari Ini');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $filterUnit = $request->query('filter_unit');
        $filterStatus = $request->query('filter_status');
        $user = auth()->user();
        
        $data = $this->getReportData($period, $user->role, $user->business_unit, $startDate, $endDate, $filterUnit, $filterStatus);

        return Inertia::render('Admin/Laporan', [
            'initialTransactions'  => $data['allTransactions'],
            'initialRevenueByUnit' => $data['revenueByUnit'],
            'initialPeriod'        => $period,
            'kpi'                  => $data['kpi'],
            'chartData'            => $data['chartData'],
            'revenueChartData'     => $data['revenueChartData'],
            'busiestDays'          => $data['busiestDays'],
            'busiestHours'         => $data['busiestHours'],
            'userRole'             => $user->role,
            'userUnit'             => $user->business_unit,
            'filters'              => [
                'start_date'    => $startDate,
                'end_date'      => $endDate,
                'filter_unit'   => $filterUnit,
                'filter_status' => $filterStatus,
            ]
        ]);
    }

    public function exportPdf(Request $request)
    {
        $period = $request->query('period', 'Hari Ini');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $filterUnit = $request->query('filter_unit');
        $filterStatus = $request->query('filter_status');
        $user = auth()->user();
        
        $data = $this->getReportData($period, $user->role, $user->business_unit, $startDate, $endDate, $filterUnit, $filterStatus);
        $data['period'] = $period;
        $data['start_date'] = $startDate;
        $data['end_date'] = $endDate;
        $data['date_generated'] = now()->format('d F Y H:i');

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('admin.reports.pdf', $data);
        return $pdf->download('Laporan_Venus_Space_' . str_replace(' ', '_', $period) . '.pdf');
    }

    public function exportExcel(Request $request)
    {
        $period = $request->query('period', 'Hari Ini');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $filterUnit = $request->query('filter_unit');
        $filterStatus = $request->query('filter_status');
        $user = auth()->user();
        
        $data = $this->getReportData($period, $user->role, $user->business_unit, $startDate, $endDate, $filterUnit, $filterStatus);
        $data['period'] = $period;
        $data['start_date'] = $startDate;
        $data['end_date'] = $endDate;
        $data['date_generated'] = now()->format('d F Y H:i');

        $filename = 'Laporan_Venus_Space_' . str_replace(' ', '_', $period) . '.xlsx';

        return Excel::download(new LaporanExport($data), $filename);
    }

    private function getReportData($period, $role = null, $unit = null, $startDateStr = null, $endDateStr = null, $filterUnit = null, $filterStatus = null)
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

        if ($filterUnit && $filterUnit !== 'Semua') {
            $showDoorsmeer = $showDoorsmeer && ($filterUnit === 'Doorsmeer');
            $showBengkel = $showBengkel && ($filterUnit === 'Bengkel');
            $showRental = $showRental && ($filterUnit === 'Rental PS');
            $showVape = $showVape && ($filterUnit === 'Vape Store');
            $showCoffee = $showCoffee && ($filterUnit === 'Coffee Shop');
        }

        // 1. Fetch Doorsmeer
        $doorsmeerQuery = DoorsmeerBooking::with('user')
            ->whereBetween('created_at', [$startDate, $endDate]);

        if ($filterStatus && $filterStatus !== 'Semua') {
            if ($filterStatus === 'Lunas') {
                $doorsmeerQuery->where('status', 'done');
            } elseif ($filterStatus === 'Batal') {
                $doorsmeerQuery->where('status', 'cancelled');
            } elseif ($filterStatus === 'Pending') {
                $doorsmeerQuery->whereNotIn('status', ['done', 'cancelled']);
            }
        }

        $doorsmeer = $showDoorsmeer
            ? $doorsmeerQuery->get()->map(function($item) {
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
        $bengkelQuery = BengkelBooking::with('user')
            ->whereBetween('created_at', [$startDate, $endDate]);

        if ($filterStatus && $filterStatus !== 'Semua') {
            if ($filterStatus === 'Lunas') {
                $bengkelQuery->where('status', 'done');
            } elseif ($filterStatus === 'Batal') {
                $bengkelQuery->where('status', 'cancelled');
            } elseif ($filterStatus === 'Pending') {
                $bengkelQuery->whereNotIn('status', ['done', 'cancelled']);
            }
        }

        $bengkel = $showBengkel
            ? $bengkelQuery->get()->map(function($item) {
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
        $rentalQuery = RentalPsBooking::with('user')
            ->whereBetween('created_at', [$startDate, $endDate]);

        if ($filterStatus && $filterStatus !== 'Semua') {
            if ($filterStatus === 'Lunas') {
                $rentalQuery->where('status', 'done');
            } elseif ($filterStatus === 'Batal') {
                $rentalQuery->where('status', 'cancelled');
            } elseif ($filterStatus === 'Pending') {
                $rentalQuery->whereNotIn('status', ['done', 'cancelled']);
            }
        }

        $rental = $showRental
            ? $rentalQuery->get()->map(function($item) {
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
        } else {
            // For owner
            if ($showVape && !$showCoffee) {
                $storeQuery->where('unit', 'VAPE STORE');
            } elseif (!$showVape && $showCoffee) {
                $storeQuery->where('unit', 'COFFEE SHOP');
            } elseif (!$showVape && !$showCoffee) {
                $storeQuery->whereRaw('1 = 0');
            } else {
                // Both are allowed, apply display filter if any
                if ($filterUnit === 'Vape Store') {
                    $storeQuery->where('unit', 'VAPE STORE');
                } elseif ($filterUnit === 'Coffee Shop') {
                    $storeQuery->where('unit', 'COFFEE SHOP');
                }
            }
        }

        if ($filterStatus && $filterStatus !== 'Semua') {
            if ($filterStatus === 'Lunas') {
                $storeQuery->where(function($q) {
                    $q->where('status', 'BERHASIL')->orWhere('progress_status', 'completed');
                });
            } elseif ($filterStatus === 'Batal') {
                $storeQuery->where(function($q) {
                    $q->where('status', 'BATAL')->orWhere('progress_status', 'cancelled');
                });
            } elseif ($filterStatus === 'Pending') {
                $storeQuery->where(function($q) {
                    $q->whereNotIn('status', ['BERHASIL', 'BATAL'])
                      ->whereNotIn('progress_status', ['completed', 'cancelled']);
                });
            }
        }

        $storeOrders = ($showVape || $showCoffee)
            ? $storeQuery->get()->map(function($item) {
                $serviceName = 'Pesanan';
                if ($item->items && $item->items->count() > 0) {
                    $serviceName = $item->items->map(function($orderItem) {
                        return $orderItem->quantity . 'x ' . $orderItem->name;
                    })->implode(', ');
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
            })
            : collect();

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
        $revenueChartData = [];
        $diffDays = $startDate->diffInDays($endDate);

        $allPeriodTransactions = collect()
            ->concat($doorsmeer)->concat($bengkel)->concat($rental)->concat($storeOrders);

        if ($diffDays <= 1) {
            for ($i = 8; $i <= 22; $i++) {
                $hour = str_pad($i, 2, '0', STR_PAD_LEFT);
                $transactionsInHour = $allPeriodTransactions->filter(function($item) use ($hour) {
                    return Carbon::parse($item['created_at'])->format('H') == $hour;
                });
                
                $count = $transactionsInHour->count();
                $revenue = $transactionsInHour->filter(fn($item) => $item['status'] === 'Lunas')->sum('amount');
                
                $chartData[] = ['label' => $hour . ':00', 'value' => $count];
                $revenueChartData[] = ['label' => $hour . ':00', 'value' => $revenue];
            }
        } else {
            $current = $startDate->copy();
            while ($current <= $endDate) {
                $dateStr = $current->format('d/m');
                $dayStr = $current->format('Y-m-d');
                $transactionsInDay = $allPeriodTransactions->filter(function($item) use ($dayStr) {
                    return Carbon::parse($item['created_at'])->format('Y-m-d') == $dayStr;
                });
                
                $count = $transactionsInDay->count();
                $revenue = $transactionsInDay->filter(fn($item) => $item['status'] === 'Lunas')->sum('amount');
                
                $chartData[] = ['label' => $dateStr, 'value' => $count];
                $revenueChartData[] = ['label' => $dateStr, 'value' => $revenue];
                $current->addDay();
            }
        }

        // Busiest Days (Senin - Minggu)
        $daysOfWeek = [
            'Monday' => 'Senin',
            'Tuesday' => 'Selasa',
            'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis',
            'Friday' => 'Jumat',
            'Saturday' => 'Sabtu',
            'Sunday' => 'Minggu'
        ];
        $busiestDays = [];
        foreach ($daysOfWeek as $eng => $ind) {
            $count = $allPeriodTransactions->filter(function($item) use ($eng) {
                return Carbon::parse($item['created_at'])->format('l') === $eng;
            })->count();
            $busiestDays[] = ['label' => $ind, 'value' => $count];
        }

        // Busiest Hours (08:00 - 22:00 aggregated)
        $busiestHours = [];
        for ($i = 8; $i <= 22; $i++) {
            $hour = str_pad($i, 2, '0', STR_PAD_LEFT);
            $count = $allPeriodTransactions->filter(function($item) use ($hour) {
                return Carbon::parse($item['created_at'])->format('H') == $hour;
            })->count();
            $busiestHours[] = ['label' => $hour . ':00', 'value' => $count];
        }

        return [
            'allTransactions'  => $allTransactions,
            'revenueByUnit'    => array_values($revenueByUnit),
            'kpi'              => $kpi,
            'chartData'        => $chartData,
            'revenueChartData' => $revenueChartData,
            'busiestDays'      => $busiestDays,
            'busiestHours'     => $busiestHours
        ];
    }
}
