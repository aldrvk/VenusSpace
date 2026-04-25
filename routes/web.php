<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Home', [
//         'user' => 'Vincent'
//     ]);
// });

Route::get('/', function () {
    return Inertia::render('Welcome', [

    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
                
    ]);
});

