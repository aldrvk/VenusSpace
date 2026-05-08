<?php

namespace App\Http\Controllers;

use App\Models\DoorsmeerBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DoorsmeerBookingController extends Controller
{
    // ─────────────────────────────────────────────────────────────────────────
    // USER: submit booking baru
    // POST /doorsmeer/booking
    // ─────────────────────────────────────────────────────────────────────────
    public function store(Request $request)
    {
        $request->validate([
            'service_id'       => 'required|string',
            'service_name'     => 'required|string',
            'service_subtitle' => 'required|string',
            'service_price'    => 'required|integer|min:0',
            'service_duration' => 'required|string',
            'vehicle_class'    => 'required|string',
            'license_plate'    => 'required|string|max:20',
            'appointment_date' => 'required|date|after_or_equal:today',
            'time_slot'        => 'required|string',
        ]);

        $booking = DoorsmeerBooking::create([
            'booking_code'     => 'DS-' . strtoupper(Str::random(5)),
            'user_id'          => auth()->id(),
            'service_id'       => $request->service_id,
            'service_name'     => $request->service_name,
            'service_subtitle' => $request->service_subtitle,
            'service_price'    => $request->service_price,
            'service_duration' => $request->service_duration,
            'vehicle_class'    => $request->vehicle_class,
            'license_plate'    => strtoupper(trim($request->license_plate)),
            'appointment_date' => $request->appointment_date,
            'time_slot'        => $request->time_slot,
            'status'           => 'pending',
        ]);

        return redirect()->route('doorsmeer.tracking', $booking->booking_code);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // USER: halaman tracking progress booking
    // GET /doorsmeer/tracking/{code}
    // ─────────────────────────────────────────────────────────────────────────
    public function tracking(string $code)
    {
        $booking = DoorsmeerBooking::where('booking_code', $code)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        return Inertia::render('Doorsmeer/tracking', [
            'booking' => $this->formatBooking($booking),
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // USER: daftar semua booking milik user yang login
    // GET /doorsmeer/my-bookings
    // ─────────────────────────────────────────────────────────────────────────
    public function myBookings()
    {
        $bookings = DoorsmeerBooking::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($b) => $this->formatBooking($b));

        return Inertia::render('Doorsmeer/my_bookings', [
            'bookings' => $bookings,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN: daftar semua booking (untuk halaman BookingDoorsmeer)
    // GET /admin/booking-doorsmeer  (return JSON via props)
    // ─────────────────────────────────────────────────────────────────────────
    public function adminIndex()
    {
        $bookings = DoorsmeerBooking::with('user')
            ->orderByRaw("FIELD(status, 'pending', 'in_queue', 'washing', 'rinsing', 'verified', 'done', 'rejected')")
            ->orderBy('appointment_date')
            ->orderBy('time_slot')
            ->get()
            ->map(fn ($b) => $this->formatBookingAdmin($b));

        // Stall summary
        $stalls = $this->getStallSummary();

        return Inertia::render('Admin/BookingDoorsmeer', [
            'bookings' => $bookings,
            'stalls'   => $stalls,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN: verifikasi booking (approve)
    // POST /admin/doorsmeer/verify/{id}
    // ─────────────────────────────────────────────────────────────────────────
    public function verify(Request $request, DoorsmeerBooking $booking)
    {
        $request->validate([
            'stall' => 'required|string',
        ]);

        abort_if($booking->status !== 'pending', 422, 'Booking sudah diproses sebelumnya.');

        $booking->update([
            'status'      => 'verified',
            'stall'       => $request->stall,
            'verified_at' => now(),
        ]);

        return back()->with('success', "Booking {$booking->booking_code} berhasil diverifikasi.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN: tolak booking
    // POST /admin/doorsmeer/reject/{id}
    // ─────────────────────────────────────────────────────────────────────────
    public function reject(Request $request, DoorsmeerBooking $booking)
    {
        $request->validate([
            'admin_notes' => 'nullable|string|max:255',
        ]);

        abort_if($booking->status !== 'pending', 422, 'Booking sudah diproses sebelumnya.');

        $booking->update([
            'status'      => 'rejected',
            'admin_notes' => $request->admin_notes ?? 'Ditolak oleh admin.',
        ]);

        return back()->with('success', "Booking {$booking->booking_code} ditolak.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN: update progress pengerjaan
    // POST /admin/doorsmeer/progress/{id}
    // ─────────────────────────────────────────────────────────────────────────
    public function updateProgress(Request $request, DoorsmeerBooking $booking)
    {
        $allowed = ['in_queue', 'washing', 'rinsing', 'done'];

        $request->validate([
            'status' => 'required|in:' . implode(',', $allowed),
        ]);

        $currentAllowed = ['verified', 'in_queue', 'washing', 'rinsing'];
        abort_if(!in_array($booking->status, $currentAllowed), 422, 'Status tidak dapat diperbarui.');

        $data = ['status' => $request->status];
        if ($request->status === 'done') {
            $data['done_at'] = now();
        }

        $booking->update($data);

        return back()->with('success', "Status booking {$booking->booking_code} diperbarui.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN: polling endpoint untuk real-time update status
    // GET /api/doorsmeer/status/{code}
    // ─────────────────────────────────────────────────────────────────────────
    public function statusPoll(string $code)
    {
        $booking = DoorsmeerBooking::where('booking_code', $code)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        return response()->json([
            'status'        => $booking->status,
            'progressLabel' => $booking->progressLabel(),
            'progressStep'  => $booking->progressStep(),
            'stall'         => $booking->stall,
            'admin_notes'   => $booking->admin_notes,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────────

    private function formatBooking(DoorsmeerBooking $b): array
    {
        return [
            'id'              => $b->id,
            'booking_code'    => $b->booking_code,
            'service_name'    => $b->service_name,
            'service_subtitle'=> $b->service_subtitle,
            'service_price'   => $b->service_price,
            'service_duration'=> $b->service_duration,
            'vehicle_class'   => $b->vehicle_class,
            'license_plate'   => $b->license_plate,
            'appointment_date'=> $b->appointment_date->format('d M Y'),
            'time_slot'       => $b->time_slot,
            'status'          => $b->status,
            'progress_label'  => $b->progressLabel(),
            'progress_step'   => $b->progressStep(),
            'stall'           => $b->stall,
            'admin_notes'     => $b->admin_notes,
            'verified_at'     => $b->verified_at?->format('d M Y H:i'),
            'done_at'         => $b->done_at?->format('d M Y H:i'),
            'created_at'      => $b->created_at->format('d M Y H:i'),
        ];
    }

    private function formatBookingAdmin(DoorsmeerBooking $b): array
    {
        return array_merge($this->formatBooking($b), [
            'customer_name'  => $b->user->name,
            'customer_email' => $b->user->email,
        ]);
    }

    private function getStallSummary(): array
    {
        $stallNames = ['Stall 1', 'Stall 2', 'Stall 3'];
        $activeStatuses = ['in_queue', 'washing', 'rinsing'];

        $occupied = DoorsmeerBooking::whereIn('status', $activeStatuses)
            ->whereNotNull('stall')
            ->get()
            ->keyBy('stall');

        return array_map(function ($name) use ($occupied) {
            if ($occupied->has($name)) {
                $b = $occupied[$name];
                return [
                    'id'       => $name,
                    'label'    => strtoupper($name),
                    'status'   => 'terisi',
                    'plate'    => $b->license_plate,
                    'vehicle'  => $b->vehicle_class,
                    'progress' => $b->progressLabel(),
                ];
            }
            return [
                'id'    => $name,
                'label' => strtoupper($name),
                'status'=> 'tersedia',
            ];
        }, $stallNames);
    }
}
