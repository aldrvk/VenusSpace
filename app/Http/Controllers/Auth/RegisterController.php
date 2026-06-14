<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Otp;
use App\Mail\RegisterOtpMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;

class RegisterController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'email'        => [
                'required', 'string', 'email', 'max:255', 'unique:users',
                'regex:/@gmail\.com$/',
            ],
            'password'     => [
                'required', 'confirmed',
                Password::min(8)->letters()->mixedCase()->numbers()->symbols(),
            ],
        ], [
            'email.unique'       => 'Alamat email ini sudah terdaftar. Silakan masuk (Login) atau gunakan fitur Lupa Kata Sandi jika Anda lupa kata sandinya.',
            'email.regex'        => 'Email harus menggunakan alamat @gmail.com.',
            'password.min'       => 'Kata sandi minimal 8 karakter.',
        ]);

        // Simpan data pendaftaran sementara ke session
        session(['pending_registration' => [
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]]);

        // Generate 6 digit OTP
        $otpCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        Otp::updateOrCreate(
            ['identifier' => $request->email],
            [
                'otp'        => $otpCode,
                'expires_at' => now()->addMinutes(5),
            ]
        );

        try {
            Mail::to($request->email)->queue(new RegisterOtpMail($otpCode));
        } catch (\Exception $e) {
            \Log::error("Gagal kirim OTP registrasi ke {$request->email}: " . $e->getMessage());
        }

        return back()->with('otp_sent', true)->with('otp_email', $request->email);
    }

    /**
     * Verifikasi OTP registrasi dan buat user baru.
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'otp'   => ['required', 'string', 'size:6'],
        ]);

        $otpRecord = Otp::where('identifier', $request->email)
                        ->where('otp', $request->otp)
                        ->first();

        if (!$otpRecord) {
            return response()->json(['message' => 'Kode OTP tidak valid atau salah.'], 422);
        }

        if (!$otpRecord->isValid()) {
            return response()->json(['message' => 'Kode OTP sudah kedaluwarsa. Silakan lakukan registrasi ulang.'], 422);
        }

        $pending = session('pending_registration');

        if (!$pending || $pending['email'] !== $request->email) {
            return response()->json(['message' => 'Sesi pendaftaran Anda telah kedaluwarsa atau tidak valid. Silakan daftarkan ulang.'], 422);
        }

        // Hapus OTP
        $otpRecord->delete();

        // Buat user baru di database
        $user = User::create([
            'name'              => $pending['name'],
            'email'             => $pending['email'],
            'password'          => $pending['password'],
            'email_verified_at' => now(),
        ]);

        // Hapus data pendaftaran sementara dari session
        session()->forget('pending_registration');

        // Login user
        Auth::login($user, true);
        $request->session()->regenerate();

        return response()->json([
            'success'  => true,
            'redirect' => '/',
            'message'  => 'Pendaftaran berhasil! Selamat datang di Venus Hub.',
        ]);
    }

    /**
     * Kirim ulang OTP registrasi.
     */
    public function resendOtp(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $pending = session('pending_registration');

        if (!$pending || $pending['email'] !== $request->email) {
            return response()->json(['message' => 'Sesi pendaftaran Anda telah kedaluwarsa. Silakan daftarkan ulang.'], 422);
        }

        $otpCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        Otp::updateOrCreate(
            ['identifier' => $request->email],
            [
                'otp'        => $otpCode,
                'expires_at' => now()->addMinutes(5),
            ]
        );

        try {
            Mail::to($request->email)->queue(new RegisterOtpMail($otpCode));
        } catch (\Exception $e) {
            \Log::error("Gagal kirim ulang OTP registrasi ke {$request->email}: " . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => 'Kode OTP baru telah dikirim ke email Anda.']);
    }
}
