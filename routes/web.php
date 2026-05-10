<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\DoorsmeerBookingController;
use App\Http\Controllers\BengkelBookingController;
use App\Http\Controllers\RentalPsBookingController;
use App\Http\Controllers\StoreAdminController;

// ── Halaman Utama ──────────────────────────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('Welcome');
})->middleware('redirectAdmin');

Route::middleware('redirectAdmin')->group(function () {
    // ── Doorsmeer ─────────────────────────────────────────────────────────────────
    Route::get('/doorsmeer', [DoorsmeerBookingController::class, 'index'])->name('doorsmeer.index');

    // ── Bengkel ───────────────────────────────────────────────────────────────────
    Route::get('/bengkel', [BengkelBookingController::class, 'index'])->name('bengkel.index');

    // ── Rental PS ─────────────────────────────────────────────────────────────────
    Route::get('/rental-ps', [RentalPsBookingController::class, 'index'])->name('rental-ps.index');

    Route::get('/doorsmeer/booking-detail', function () {
        return Inertia::render('Doorsmeer/booking_detail');
    })->name('doorsmeer.booking_detail');

    Route::get('/doorsmeer/booking-receipt', function () {
        return Inertia::render('Doorsmeer/booking_receipt');
    })->name('doorsmeer.booking_receipt');

    Route::get('/bengkel/booking-detail', function () {
        return Inertia::render('Bengkel/booking_detail');
    })->name('bengkel.booking_detail');

    Route::get('/bengkel/booking-receipt', function () {
        return Inertia::render('Bengkel/booking_receipt');
    })->name('bengkel.booking_receipt');

    Route::get('/rental-ps/booking-detail', function () {
        return Inertia::render('RentalPs/booking_detail');
    })->name('rental-ps.booking_detail');

    Route::get('/rental-ps/booking-receipt', function () {
        return Inertia::render('RentalPs/booking_receipt');
    })->name('rental-ps.booking_receipt');

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

    Route::get('/vape-store/checkout', function () {
        return Inertia::render('VapeStore/checkout');
    })->name('vape.checkout');

    Route::get('/vape-store/receipt', function () {
        return Inertia::render('VapeStore/receipt');
    })->name('vape.receipt');

    // ── Coffee Shop ───────────────────────────────────────────────────────────────
    Route::get('/coffee-shop', function () {
        return Inertia::render('CoffeeShop/all_items');
    })->name('coffee.all');

    Route::get('/coffee-shop/drinks', function () {
        return Inertia::render('CoffeeShop/drinks');
    })->name('coffee.drinks');

    Route::get('/coffee-shop/foods', function () {
        return Inertia::render('CoffeeShop/foods');
    })->name('coffee.foods');

    Route::get('/coffee-shop/snacks', function () {
        return Inertia::render('CoffeeShop/snacks');
    })->name('coffee.snacks');

    Route::get('/coffee-shop/product/{id}', function ($id) {
        return Inertia::render('CoffeeShop/product_detail', ['id' => $id]);
    })->name('coffee.product');

    Route::get('/coffee-shop/cart', function () {
        return Inertia::render('CoffeeShop/cart');
    })->name('coffee.cart');

    Route::get('/coffee-shop/checkout', function () {
        return Inertia::render('CoffeeShop/checkout');
    })->name('coffee.checkout');

    Route::get('/coffee-shop/receipt', function () {
        return Inertia::render('CoffeeShop/receipt');
    })->name('coffee.receipt');
});

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

    Route::middleware('redirectAdmin')->group(function () {
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

        // ── Bengkel Booking (user) ────────────────────────────────────────────────
        Route::post('/bengkel/booking', [BengkelBookingController::class, 'store'])->name('bengkel.booking.store');
        Route::get('/bengkel/tracking/{code}', [BengkelBookingController::class, 'tracking'])->name('bengkel.tracking');
        Route::get('/bengkel/my-bookings', [BengkelBookingController::class, 'myBookings'])->name('bengkel.my_bookings');
        Route::get('/api/bengkel/status/{code}', [BengkelBookingController::class, 'statusPoll'])->name('bengkel.status_poll');

        // ── Rental PS Booking (user) ──────────────────────────────────────────────
        Route::post('/rental-ps/booking', [RentalPsBookingController::class, 'store'])->name('rental-ps.booking.store');
        Route::get('/rental-ps/tracking/{code}', [RentalPsBookingController::class, 'tracking'])->name('rental-ps.tracking');
        Route::get('/rental-ps/my-bookings', [RentalPsBookingController::class, 'myBookings'])->name('rental-ps.my_bookings');
        Route::get('/api/rental-ps/status/{code}', [RentalPsBookingController::class, 'statusPoll'])->name('rental-ps.status_poll');
    });

    // ── Admin Routes ──────────────────────────────────────────────────────────
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', fn () => Inertia::render('Admin/Dashboard'))->name('dashboard');

        // Doorsmeer – data dari DB + actions
        Route::get('/booking-doorsmeer', [DoorsmeerBookingController::class, 'adminIndex'])->name('doorsmeer');
        Route::post('/doorsmeer/verify/{booking}', [DoorsmeerBookingController::class, 'verify'])->name('doorsmeer.verify');
        Route::post('/doorsmeer/progress/{booking}', [DoorsmeerBookingController::class, 'updateProgress'])->name('doorsmeer.progress');
        Route::post('/doorsmeer/cancel/{booking}', [DoorsmeerBookingController::class, 'cancel'])->name('doorsmeer.cancel');

        // Walk-in
        Route::get('/doorsmeer/walk-in', [DoorsmeerBookingController::class, 'walkIn'])->name('doorsmeer.walk-in');
        Route::post('/doorsmeer/walk-in', [DoorsmeerBookingController::class, 'storeWalkIn'])->name('doorsmeer.store-walk-in');

        // Bengkel
        Route::get('/booking-bengkel', [BengkelBookingController::class, 'adminIndex'])->name('bengkel');
        Route::post('/bengkel/verify/{booking}', [BengkelBookingController::class, 'verify'])->name('bengkel.verify');
        Route::post('/bengkel/progress/{booking}', [BengkelBookingController::class, 'updateProgress'])->name('bengkel.progress');
        Route::post('/bengkel/cancel/{booking}', [BengkelBookingController::class, 'cancel'])->name('bengkel.cancel');
        Route::get('/bengkel/walk-in', [BengkelBookingController::class, 'walkIn'])->name('bengkel.walk-in');
        Route::post('/bengkel/walk-in', [BengkelBookingController::class, 'storeWalkIn'])->name('bengkel.store-walk-in');

        // Rental PS
        Route::get('/booking-rental-ps', [RentalPsBookingController::class, 'adminIndex'])->name('rentalps');
        Route::post('/rental-ps/verify/{booking}', [RentalPsBookingController::class, 'verify'])->name('rental-ps.verify');
        Route::post('/rental-ps/progress/{booking}', [RentalPsBookingController::class, 'updateProgress'])->name('rental-ps.progress');
        Route::post('/rental-ps/cancel/{booking}', [RentalPsBookingController::class, 'cancel'])->name('rental-ps.cancel');
        Route::get('/rental-ps/walk-in', [RentalPsBookingController::class, 'walkIn'])->name('rental-ps.walk-in');
        Route::post('/rental-ps/walk-in', [RentalPsBookingController::class, 'storeWalkIn'])->name('rental-ps.store-walk-in');
        Route::get('/katalog-coffee', [StoreAdminController::class, 'katalogCoffee'])->name('coffee');
        Route::get('/katalog-vape', [StoreAdminController::class, 'katalogVape'])->name('vape');
        Route::get('/pesanan-store', [StoreAdminController::class, 'pesananStore'])->name('pesanan-store');
        
        // Store actions
        Route::post('/store/product', [StoreAdminController::class, 'storeProduct'])->name('store.product.store');
        Route::put('/store/product/{product}', [StoreAdminController::class, 'updateProduct'])->name('store.product.update');
        Route::delete('/store/product/{product}', [StoreAdminController::class, 'destroyProduct'])->name('store.product.destroy');
        Route::post('/pesanan-store/{order}/confirm', [StoreAdminController::class, 'confirmPayment'])->name('store.order.confirm');
        Route::get('/jadwal', fn () => Inertia::render('Admin/Jadwal'))->name('jadwal');
        Route::get('/laporan', fn () => Inertia::render('Admin/Laporan'))->name('laporan');
        Route::get('/pengaturan', fn () => Inertia::render('Admin/Pengaturan'))->name('pengaturan');
    });

    // Logout
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

});
