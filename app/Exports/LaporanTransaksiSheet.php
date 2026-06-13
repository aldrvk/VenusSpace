<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LaporanTransaksiSheet implements FromArray, WithTitle, WithStyles, WithColumnWidths
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
            ['DAFTAR TRANSAKSI DETAIL'],
            ['Periode: ' . $period],
            ['Dicetak: ' . $dateGenerated],
            [''],
            ['No', 'Kode', 'Tanggal', 'Waktu', 'Pelanggan', 'Unit Usaha', 'Layanan / Item', 'Nominal', 'Status'],
        ];

        foreach ($this->data['allTransactions'] as $idx => $t) {
            $rows[] = [
                $idx + 1,
                $t['id'],
                $t['date'] ?? '-',
                $t['time'],
                $t['customer'],
                $t['unit'],
                $t['service'],
                $t['amount'],
                $t['status'],
            ];
        }

        return $rows;
    }

    public function title(): string
    {
        return 'Daftar Transaksi';
    }

    public function columnWidths(): array
    {
        return [
            'A' => 6,
            'B' => 16,
            'C' => 14,
            'D' => 10,
            'E' => 22,
            'F' => 16,
            'G' => 45, // Wider column for detailed items list
            'H' => 18,
            'I' => 12,
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        $sheet->mergeCells('A1:I1');
        $sheet->mergeCells('A2:I2');
        $sheet->mergeCells('A3:I3');

        $lastRow = count($this->data['allTransactions']) + 5;
        for ($i = 6; $i <= $lastRow; $i++) {
            $sheet->getStyle("A{$i}")->getNumberFormat()->setFormatCode('#,##0');
            $sheet->getStyle("H{$i}")->getNumberFormat()->setFormatCode('"Rp "#,##0');
        }

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
                'font' => ['bold' => true, 'size' => 9, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => [
                    'fillType' => 'solid',
                    'startColor' => ['rgb' => '1E293B'], // Charcoal Slate
                ],
            ],
        ];
    }
}
