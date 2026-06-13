<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LaporanKpiSheet implements FromArray, WithTitle, WithStyles, WithColumnWidths
{
    protected array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function array(): array
    {
        $kpi = $this->data['kpi'];
        $period = $this->data['period'] ?? '-';
        $dateGenerated = $this->data['date_generated'] ?? now()->format('d F Y H:i');

        return [
            ['LAPORAN EKSEKUTIF VENUS SPACE'],
            ['Periode: ' . $period],
            ['Dicetak: ' . $dateGenerated],
            [''],
            ['INDIKATOR', 'NILAI'],
            ['Total Pendapatan (Lunas)', $kpi['totalRevenue']],
            ['Total Transaksi', $kpi['totalBookings']],
            ['Rata-rata per Transaksi', $kpi['totalBookings'] > 0 ? round($kpi['totalRevenue'] / $kpi['totalBookings']) : 0],
            ['Pending Pembayaran', $kpi['pendingAmount']],
            ['Jumlah Transaksi Pending', $kpi['pendingCount']],
            ['Unit Aktif', count($this->data['revenueByUnit'])],
        ];
    }

    public function title(): string
    {
        return 'Ringkasan KPI';
    }

    public function columnWidths(): array
    {
        return [
            'A' => 35,
            'B' => 30,
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        // Merge header cells
        $sheet->mergeCells('A1:B1');
        $sheet->mergeCells('A2:B2');
        $sheet->mergeCells('A3:B3');

        // Apply number formatting to column B
        $sheet->getStyle('B6')->getNumberFormat()->setFormatCode('"Rp "#,##0');
        $sheet->getStyle('B7')->getNumberFormat()->setFormatCode('#,##0');
        $sheet->getStyle('B8')->getNumberFormat()->setFormatCode('"Rp "#,##0');
        $sheet->getStyle('B9')->getNumberFormat()->setFormatCode('"Rp "#,##0');
        $sheet->getStyle('B10')->getNumberFormat()->setFormatCode('#,##0');
        $sheet->getStyle('B11')->getNumberFormat()->setFormatCode('#,##0');

        return [
            1 => [
                'font' => ['bold' => true, 'size' => 16, 'color' => ['rgb' => '0F172A']],
                'alignment' => ['horizontal' => 'center'],
            ],
            2 => [
                'font' => ['italic' => true, 'size' => 10, 'color' => ['rgb' => '475569']],
                'alignment' => ['horizontal' => 'center'],
            ],
            3 => [
                'font' => ['italic' => true, 'size' => 10, 'color' => ['rgb' => '475569']],
                'alignment' => ['horizontal' => 'center'],
            ],
            5 => [
                'font' => ['bold' => true, 'size' => 10, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => [
                    'fillType' => 'solid',
                    'startColor' => ['rgb' => '1E293B'], // Charcoal Slate
                ],
            ],
            'A6:A11' => [
                'font' => ['bold' => true, 'size' => 10],
            ],
            'B6:B11' => [
                'font' => ['size' => 10],
                'alignment' => ['horizontal' => 'right'],
            ],
        ];
    }
}
