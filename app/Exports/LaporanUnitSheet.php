<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LaporanUnitSheet implements FromArray, WithTitle, WithStyles, WithColumnWidths
{
    protected array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function array(): array
    {
        $period = $this->data['period'] ?? '-';
        $dateGenerated = $this->data['date_generated'] ?? now()->format('d F Y H:i');

        $rows = [
            ['PENDAPATAN PER UNIT USAHA'],
            ['Periode: ' . $period],
            ['Dicetak: ' . $dateGenerated],
            [''],
            ['Unit Usaha', 'Jumlah Transaksi', 'Pendapatan', 'Persentase'],
        ];

        foreach ($this->data['revenueByUnit'] as $u) {
            $rows[] = [
                $u['unit'],
                $u['bookings'],
                $u['amount'],
                $u['pct'] / 100,
            ];
        }

        // Total row
        $totalBookings = array_sum(array_column($this->data['revenueByUnit'], 'bookings'));
        $totalAmount = array_sum(array_column($this->data['revenueByUnit'], 'amount'));

        $rows[] = [''];
        $rows[] = [
            'TOTAL',
            $totalBookings,
            $totalAmount,
            1.00, // 100%
        ];

        return $rows;
    }

    public function title(): string
    {
        return 'Pendapatan Per Unit';
    }

    public function columnWidths(): array
    {
        return [
            'A' => 25,
            'B' => 20,
            'C' => 25,
            'D' => 15,
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        $sheet->mergeCells('A1:D1');
        $sheet->mergeCells('A2:D2');
        $sheet->mergeCells('A3:D3');

        $lastDataRow = count($this->data['revenueByUnit']) + 5; // header (5) + data rows

        // Format data rows
        for ($i = 6; $i <= $lastDataRow; $i++) {
            $sheet->getStyle("B{$i}")->getNumberFormat()->setFormatCode('#,##0');
            $sheet->getStyle("C{$i}")->getNumberFormat()->setFormatCode('"Rp "#,##0');
            $sheet->getStyle("D{$i}")->getNumberFormat()->setFormatCode('0%');
        }

        $totalRow = $lastDataRow + 2; // data rows + spacer + total row

        // Format total row cells
        $sheet->getStyle("B{$totalRow}")->getNumberFormat()->setFormatCode('#,##0');
        $sheet->getStyle("C{$totalRow}")->getNumberFormat()->setFormatCode('"Rp "#,##0');
        $sheet->getStyle("D{$totalRow}")->getNumberFormat()->setFormatCode('0%');

        return [
            1 => [
                'font' => ['bold' => true, 'size' => 16, 'color' => ['rgb' => '0F172A']],
                'alignment' => ['horizontal' => 'left'],
            ],
            2 => [
                'font' => ['italic' => true, 'size' => 10, 'color' => ['rgb' => '475569']],
                'alignment' => ['horizontal' => 'left'],
            ],
            3 => [
                'font' => ['italic' => true, 'size' => 10, 'color' => ['rgb' => '475569']],
                'alignment' => ['horizontal' => 'left'],
            ],
            5 => [
                'font' => ['bold' => true, 'size' => 10, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => [
                    'fillType' => 'solid',
                    'startColor' => ['rgb' => '1E293B'], // Charcoal Slate
                ],
            ],
            $totalRow => [
                'font' => ['bold' => true, 'size' => 11],
                'borders' => [
                    'top' => ['borderStyle' => 'thin'],
                    'bottom' => ['borderStyle' => 'double'], // Double accounting line
                ],
            ],
        ];
    }
}
