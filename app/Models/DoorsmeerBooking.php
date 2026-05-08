<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DoorsmeerBooking extends Model
{
    protected $fillable = [
        'booking_code',
        'user_id',
        'service_id',
        'service_name',
        'service_subtitle',
        'service_price',
        'service_duration',
        'vehicle_class',
        'license_plate',
        'appointment_date',
        'time_slot',
        'status',
        'stall',
        'admin_notes',
        'verified_at',
        'done_at',
    ];

    protected $casts = [
        'appointment_date' => 'date',
        'verified_at'      => 'datetime',
        'done_at'          => 'datetime',
        'service_price'    => 'integer',
    ];

    // ── Status helpers ────────────────────────────────────────────────────────

    public function isPending(): bool    { return $this->status === 'pending'; }
    public function isVerified(): bool   { return $this->status === 'verified'; }
    public function isRejected(): bool   { return $this->status === 'rejected'; }
    public function isDone(): bool       { return $this->status === 'done'; }

    /** Label progress yang ditampilkan ke pengguna */
    public function progressLabel(): string
    {
        return match ($this->status) {
            'pending'   => 'Menunggu Verifikasi',
            'verified'  => 'Booking Dikonfirmasi',
            'rejected'  => 'Booking Ditolak',
            'in_queue'  => 'Dalam Antrian',
            'washing'   => 'Sedang Dicuci',
            'rinsing'   => 'Finishing / Bilas',
            'done'      => 'Selesai',
            default     => 'Tidak Diketahui',
        };
    }

    /** Urutan progress untuk tampilan stepper (0-based) */
    public function progressStep(): int
    {
        return match ($this->status) {
            'pending'  => 0,
            'verified' => 1,
            'in_queue' => 2,
            'washing'  => 3,
            'rinsing'  => 4,
            'done'     => 5,
            default    => 0,
        };
    }

    // ── Relationships ─────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ── Scopes ────────────────────────────────────────────────────────────────

    public function scopeToday($query)
    {
        return $query->whereDate('appointment_date', today())
                     ->orWhere(function ($q) {
                         $q->whereIn('status', ['pending', 'verified', 'in_queue', 'washing', 'rinsing'])
                           ->whereDate('appointment_date', '<=', today());
                     });
    }

    public function scopePendingFirst($query)
    {
        return $query->orderByRaw("FIELD(status, 'pending', 'verified', 'in_queue', 'washing', 'rinsing', 'done', 'rejected')");
    }
}
