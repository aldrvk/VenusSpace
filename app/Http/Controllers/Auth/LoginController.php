<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /**
     * Tangani permintaan autentikasi masuk langsung (tanpa OTP).
     */
    public function store(Request $request)
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => 'Email atau kata sandi yang Anda masukkan salah.',
            ])->onlyInput('email');
        }

        $user = Auth::user();

        // Validasi email @gmail.com untuk user biasa
        if (!in_array($user->role, ['admin', 'owner', 'kasir']) && !str_ends_with($user->email, '@gmail.com')) {
            Auth::logout();
            return back()->withErrors([
                'email' => 'Email harus menggunakan alamat @gmail.com.',
            ])->onlyInput('email');
        }

        $request->session()->regenerate();

        // Track last login
        $user->update(['last_login_at' => now()]);

        $isAdminRole = in_array($user->role, ['admin', 'owner', 'kasir']);
        $redirect = $isAdminRole ? '/admin/dashboard' : '/';
        
        $message = $isAdminRole
            ? 'Masuk berhasil! Selamat datang ' . ($user->role === 'owner' ? 'Pemilik' : ($user->role === 'kasir' ? 'Kasir' : 'Admin')) . '.'
            : 'Masuk berhasil! Selamat datang kembali.';

        if ($request->has('redirect') && !$isAdminRole) {
            $redirect = $request->query('redirect');
            return redirect($redirect)->with('success', $message);
        }

        return redirect()->intended($redirect)->with('success', $message);
    }

    public function destroy(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
