<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('memory_limit', '1024M');
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('role', 'owner')->first();
auth()->login($user);

$request = Illuminate\Http\Request::create('/admin/laporan/export', 'GET', [
    'period' => 'Bulan Ini'
]);

try {
    echo "Running exportPdf with font subsetting DISABLED...\n";
    $start = microtime(true);
    
    $controller = new App\Http\Controllers\ReportController();
    
    // Simulate setting options
    $data = $this_data = (new \ReflectionMethod($controller, 'getReportData'))->invoke($controller, 'Bulan Ini', $user->role, null, null, null, null, null);
    $data['period'] = 'Bulan Ini';
    $data['start_date'] = null;
    $data['end_date'] = null;
    $data['date_generated'] = now()->format('d F Y H:i');
    
    // Limit to 100 transactions in test
    $data['total_transactions_count'] = $data['allTransactions']->count();
    $data['pdf_limit'] = 100;
    $data['allTransactions'] = $data['allTransactions']->take(100);
    
    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('admin.reports.pdf', $data)
        ->setOption('enable_font_subsetting', false)
        ->setOption('isRemoteEnabled', false);
        
    $output = $pdf->output();
    
    $time = microtime(true) - $start;
    echo "Success! Time taken: " . round($time, 2) . " seconds. Output size: " . strlen($output) . " bytes\n";
} catch (\Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n";
}
