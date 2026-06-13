<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('role', 'owner')->first();
auth()->login($user);

$request = Illuminate\Http\Request::create('/admin/laporan/export-excel', 'GET', [
    'period' => 'Bulan Ini',
    'filter_unit' => 'Doorsmeer',
    'filter_status' => 'Lunas'
]);

try {
    echo "Running exportExcel...\n";
    $controller = new App\Http\Controllers\ReportController();
    $response = $controller->exportExcel($request);
    echo "Success: " . get_class($response) . "\n";
} catch (\Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n";
}
