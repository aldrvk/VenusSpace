<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Venus Space - {{ $period }}</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            font-size: 12px;
            color: #333;
            line-height: 1.5;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #1a1a1a;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0 0;
            color: #666;
        }
        .kpi-container {
            margin-bottom: 30px;
            width: 100%;
        }
        .kpi-card {
            width: 23%;
            display: inline-block;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin-right: 1%;
            text-align: center;
        }
        .kpi-card h4 {
            margin: 0;
            font-size: 10px;
            text-transform: uppercase;
            color: #888;
        }
        .kpi-card .value {
            font-size: 18px;
            font-weight: bold;
            margin: 5px 0;
            color: #0f172a;
        }
        .section {
            margin-bottom: 35px;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #0F172A;
            border-left: 4px solid #1E293B;
            padding-left: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        th {
            background: #1E293B;
            text-align: left;
            padding: 10px;
            border-bottom: 2px solid #cbd5e1;
            font-size: 10px;
            text-transform: uppercase;
            color: #ffffff;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        td {
            padding: 9px 10px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 11px;
            color: #334155;
        }
        .tr-even {
            background-color: #f8fafc;
        }
        .status {
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            display: inline-block;
        }
        .status-lunas { background: #dcfce7; color: #15803d; }
        .status-pending { background: #fef3c7; color: #b45309; }
        .status-batal { background: #fee2e2; color: #b91c1c; }
        .footer {
            margin-top: 60px;
            text-align: right;
            font-size: 9px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
        }
        .unit-badge {
            font-weight: bold;
            color: #1e293b;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>VENUS SPACE</h1>
        <p style="font-weight: bold; color: #1e293b; font-size: 14px;">Laporan Eksekutif Pendapatan & Transaksi</p>
        <p style="font-size: 11px; color: #64748b; margin-top: 3px;">Periode: {{ $period }} | Dicetak pada: {{ $date_generated }}</p>
    </div>

    <div class="kpi-container">
        <div class="kpi-card">
            <h4>Total Pendapatan</h4>
            <div class="value">Rp {{ number_format($kpi['totalRevenue'], 0, ',', '.') }}</div>
        </div>
        <div class="kpi-card">
            <h4>Total Transaksi</h4>
            <div class="value">{{ number_format($kpi['totalBookings'], 0, ',', '.') }}</div>
        </div>
        <div class="kpi-card">
            <h4>Pending</h4>
            <div class="value">Rp {{ number_format($kpi['pendingAmount'], 0, ',', '.') }}</div>
        </div>
        <div class="kpi-card" style="margin-right: 0;">
            <h4>Unit Aktif</h4>
            <div class="value">{{ count($revenueByUnit) }}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Pendapatan Per Unit</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 40%;">Unit Usaha</th>
                    <th style="width: 20%;" class="text-center">Jumlah Transaksi</th>
                    <th style="width: 25%;" class="text-right">Pendapatan</th>
                    <th style="width: 15%;" class="text-right">Persentase</th>
                </tr>
            </thead>
            <tbody>
                @foreach($revenueByUnit as $u)
                <tr class="{{ $loop->index % 2 === 1 ? 'tr-even' : '' }}">
                    <td class="unit-badge">{{ $u['unit'] }}</td>
                    <td class="text-center">{{ number_format($u['bookings'], 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($u['amount'], 0, ',', '.') }}</td>
                    <td class="text-right">{{ $u['pct'] }}%</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section" style="page-break-before: auto;">
        <div class="section-title">Daftar Transaksi Detail</div>
        @foreach(collect($allTransactions)->chunk(100) as $chunkIdx => $chunk)
        <table style="page-break-inside: auto; margin-bottom: 20px; page-break-after: auto;">
            <thead>
                <tr>
                    <th style="width: 5%;" class="text-center">No</th>
                    <th style="width: 12%;">Kode</th>
                    <th style="width: 13%;">Tanggal</th>
                    <th style="width: 8%;">Waktu</th>
                    <th style="width: 15%;">Pelanggan</th>
                    <th style="width: 12%;">Unit Usaha</th>
                    <th style="width: 23%;">Layanan / Item</th>
                    <th style="width: 12%;" class="text-right">Nominal</th>
                    <th style="width: 10%;" class="text-center">Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($chunk as $idx => $t)
                <tr class="{{ $loop->index % 2 === 1 ? 'tr-even' : '' }}">
                    <td class="text-center">{{ ($chunkIdx * 100) + $idx + 1 }}</td>
                    <td style="font-family: monospace; font-size: 10px;">{{ $t['id'] }}</td>
                    <td>{{ $t['date'] }}</td>
                    <td>{{ $t['time'] }}</td>
                    <td>{{ $t['customer'] }}</td>
                    <td>{{ $t['unit'] }}</td>
                    <td style="font-size: 10px; line-height: 1.3;">{{ $t['service'] }}</td>
                    <td class="text-right">Rp {{ number_format($t['amount'], 0, ',', '.') }}</td>
                    <td class="text-center">
                        <span class="status status-{{ strtolower($t['status']) }}">
                            {{ $t['status'] }}
                        </span>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @if(!$loop->last)
            <div style="page-break-after: always;"></div>
        @endif
        @endforeach

        @if(isset($total_transactions_count) && $total_transactions_count > $pdf_limit)
            <div style="margin-top: 15px; padding: 12px; background-color: #f1f5f9; border-left: 4px solid #64748b; font-size: 11px; color: #475569; border-radius: 4px;">
                <strong>Catatan:</strong> Menampilkan {{ $pdf_limit }} dari {{ $total_transactions_count }} transaksi terbaru. Untuk mengunduh seluruh rincian data transaksi, silakan gunakan ekspor <strong>Excel</strong>.
            </div>
        @endif
    </div>

    <div class="footer">
        <p>&copy; {{ date('Y') }} Venus Space Management System. All rights reserved.</p>
    </div>
</body>
</html>
