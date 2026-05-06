<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ForgotPasswordController;

// ── Halaman Utama ──────────────────────────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('Welcome');
});

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

// ── Coffee Shop ────────────────────────────────────────────────────────────────
Route::get('/coffee-shop', function () {
    return Inertia::render('CoffeeShop/all_items');
})->name('coffee.all');

Route::get('/coffee-shop/coffee', function () {
    return Inertia::render('CoffeeShop/coffee');
})->name('coffee.coffee');

Route::get('/coffee-shop/non-coffee', function () {
    return Inertia::render('CoffeeShop/non_coffee');
})->name('coffee.non-coffee');

Route::get('/coffee-shop/snacks', function () {
    return Inertia::render('CoffeeShop/snacks');
})->name('coffee.snacks');

Route::get('/coffee-shop/product/{id}', function ($id) {
    return Inertia::render('CoffeeShop/product_detail', ['id' => $id]);
})->name('coffee.product');

Route::get('/coffee-shop/cart', function () {
    return Inertia::render('CoffeeShop/cart');
})->name('coffee.cart');

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

    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Logout
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

});
