<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\DoorsmeerBookingController;

// ── Halaman Utama ──────────────────────────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('Welcome');
});

// ── Doorsmeer ─────────────────────────────────────────────────────────────────
Route::get('/doorsmeer', function () {
    return Inertia::render('Doorsmeer/index');
})->name('doorsmeer.index');

Route::get('/doorsmeer/booking-detail', function () {
    return Inertia::render('Doorsmeer/booking_detail');
})->name('doorsmeer.booking_detail');

Route::get('/doorsmeer/booking-receipt', function () {
    return Inertia::render('Doorsmeer/booking_receipt');
})->name('doorsmeer.booking_receipt');

Route::get('/vape-store', function () {
    return Inertia::render('VapeStore/all_items');
})->name('vape.all');

Route::get('/vape-store/devices', function () {
    return Inertia::render('VapeStore/devices');
})->name('vape.devices');

Route::get('/vape-store/liquids', function () {
    return Inertia::render('VapeStore/liquids');
})->name('vape.liquids');

Route::get('/vape-store/accessories', function () {
    return Inertia::render('VapeStore/accessories');
})->name('vape.accessories');

Route::get('/vape-store/product/{id}', function ($id) {
    return Inertia::render('VapeStore/product_detail', ['id' => $id]);
})->name('vape.product');

Route::get('/vape-store/cart', function () {
    return Inertia::render('VapeStore/cart');
})->name('vape.cart');

// ── Auth: Guest only (belum login) ────────────────────────────────────────────
Route::middleware('guest')->group(function () {

    // Login
    Route::get('/login', fn () => Inertia::render('auth/Login'))->name('login');
    Route::post('/login', [LoginController::class, 'store']);

    // Register
    Route::get('/register', fn () => Inertia::render('auth/Register'))->name('register');
    Route::post('/register', [RegisterController::class, 'store']);

    // Lupa Kata Sandi
    Route::get('/forgot-password', [ForgotPasswordController::class, 'index'])->name('password.request');
    Route::post('/forgot-password/otp', [ForgotPasswordController::class, 'sendOtp'])->name('password.otp');
    Route::post('/forgot-password/reset', [ForgotPasswordController::class, 'resetPassword'])->name('password.reset');

});

// ── Auth: Butuh login ─────────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {

    // Dashboard (legacy, redirect ke admin)
    Route::get('/dashboard', function () {
        return redirect('/admin/dashboard');
    })->name('dashboard');

    // ── Doorsmeer Booking (user) ──────────────────────────────────────────────
    Route::post('/doorsmeer/booking', [DoorsmeerBookingController::class, 'store'])
         ->name('doorsmeer.booking.store');
    Route::get('/doorsmeer/tracking/{code}', [DoorsmeerBookingController::class, 'tracking'])
         ->name('doorsmeer.tracking');
    Route::get('/doorsmeer/my-bookings', [DoorsmeerBookingController::class, 'myBookings'])
         ->name('doorsmeer.my_bookings');

    // Polling AJAX – real-time status tanpa reload halaman
    Route::get('/api/doorsmeer/status/{code}', [DoorsmeerBookingController::class, 'statusPoll'])
         ->name('doorsmeer.status_poll');

    // ── Admin Routes ──────────────────────────────────────────────────────────
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', fn () => Inertia::render('Admin/Dashboard'))->name('dashboard');

        // Doorsmeer – data dari DB + actions
        Route::get('/booking-doorsmeer', [DoorsmeerBookingController::class, 'adminIndex'])->name('doorsmeer');
        Route::post('/doorsmeer/verify/{booking}', [DoorsmeerBookingController::class, 'verify'])->name('doorsmeer.verify');
        Route::post('/doorsmeer/reject/{booking}', [DoorsmeerBookingController::class, 'reject'])->name('doorsmeer.reject');
        Route::post('/doorsmeer/progress/{booking}', [DoorsmeerBookingController::class, 'updateProgress'])->name('doorsmeer.progress');

        Route::get('/booking-bengkel', fn () => Inertia::render('Admin/BookingBengkel'))->name('bengkel');
        Route::get('/booking-rental-ps', fn () => Inertia::render('Admin/BookingRentalPS'))->name('rentalps');
        Route::get('/katalog-coffee', fn () => Inertia::render('Admin/KatalogCoffeeShop'))->name('coffee');
        Route::get('/katalog-vape', fn () => Inertia::render('Admin/KatalogVapeStore'))->name('vape');
        Route::get('/jadwal', fn () => Inertia::render('Admin/Jadwal'))->name('jadwal');
        Route::get('/laporan', fn () => Inertia::render('Admin/Laporan'))->name('laporan');
        Route::get('/pengaturan', fn () => Inertia::render('Admin/Pengaturan'))->name('pengaturan');
    });

    // Logout
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

});
