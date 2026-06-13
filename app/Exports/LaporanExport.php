<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class LaporanExport implements WithMultipleSheets
{
    protected array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function sheets(): array
    {
        return [
            new LaporanKpiSheet($this->data),
            new LaporanUnitSheet($this->data),
            new LaporanTransaksiSheet($this->data),
        ];
    }
}
