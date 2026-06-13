<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        if ($user->role !== 'owner') {
            abort(403);
        }

        $query = User::whereIn('role', ['admin', 'kasir'])
            ->select('id', 'name', 'email', 'role', 'business_unit', 'phone', 'employee_status', 'last_login_at', 'created_at');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filter_role && $request->filter_role !== 'Semua') {
            $query->where('role', strtolower($request->filter_role));
        }

        if ($request->filter_unit && $request->filter_unit !== 'Semua') {
            $unitMap = [
                'Doorsmeer' => 'doorsmeer',
                'Bengkel' => 'bengkel',
                'Rental PS' => 'rental_ps',
                'Vape Store' => 'vape_store',
                'Coffee Shop' => 'coffee_shop',
            ];
            $query->where('business_unit', $unitMap[$request->filter_unit] ?? $request->filter_unit);
        }

        if ($request->filter_status && $request->filter_status !== 'Semua') {
            $statusMap = [
                'Aktif' => 'active',
                'Nonaktif' => 'inactive',
                'Cuti' => 'leave',
            ];
            $query->where('employee_status', $statusMap[$request->filter_status] ?? $request->filter_status);
        }

        $employees = $query->orderBy('name')->get()->map(function ($emp) {
            return [
                'id' => $emp->id,
                'name' => $emp->name,
                'email' => $emp->email,
                'role' => $emp->role,
                'business_unit' => $emp->business_unit,
                'phone' => $emp->phone,
                'employee_status' => $emp->employee_status ?? 'active',
                'last_login_at' => $emp->last_login_at ? $emp->last_login_at->format('d/m/Y H:i') : null,
                'created_at' => $emp->created_at->format('d/m/Y'),
            ];
        });

        // Summary stats
        $allEmployees = User::whereIn('role', ['admin', 'kasir']);
        $stats = [
            'total' => (clone $allEmployees)->count(),
            'active' => (clone $allEmployees)->where('employee_status', 'active')->count(),
            'inactive' => (clone $allEmployees)->where('employee_status', 'inactive')->count(),
            'leave' => (clone $allEmployees)->where('employee_status', 'leave')->count(),
        ];

        return Inertia::render('Admin/TimKaryawan', [
            'employees' => $employees,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'filter_role' => $request->filter_role,
                'filter_unit' => $request->filter_unit,
                'filter_status' => $request->filter_status,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        if ($user->role !== 'owner') {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => ['required', Rule::in(['admin', 'kasir'])],
            'business_unit' => ['required', Rule::in(['doorsmeer', 'bengkel', 'rental_ps', 'vape_store', 'coffee_shop'])],
            'phone' => 'nullable|string|max:20',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'business_unit' => $request->business_unit,
            'phone' => $request->phone,
            'employee_status' => 'active',
            'email_verified_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Karyawan berhasil ditambahkan.');
    }

    public function update(Request $request, User $user)
    {
        $authUser = auth()->user();
        if ($authUser->role !== 'owner') {
            abort(403);
        }
        if (!in_array($user->role, ['admin', 'kasir'], true)) {
            abort(404);
        }
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in(['admin', 'kasir'])],
            'business_unit' => ['required', Rule::in(['doorsmeer', 'bengkel', 'rental_ps', 'vape_store', 'coffee_shop'])],
            'phone' => 'nullable|string|max:20',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'business_unit' => $request->business_unit,
            'phone' => $request->phone,
        ]);

        return redirect()->back()->with('success', 'Data karyawan berhasil diperbarui.');
    }

    public function updateStatus(Request $request, User $user)
    {
        $authUser = auth()->user();
        if ($authUser->role !== 'owner') {
            abort(403);
        }

        $request->validate([
            'employee_status' => ['required', Rule::in(['active', 'inactive', 'leave'])],
        ]);

        $user->update([
            'employee_status' => $request->employee_status,
        ]);

        $statusLabel = match ($request->employee_status) {
            'active' => 'Aktif',
            'inactive' => 'Nonaktif',
            'leave' => 'Cuti',
        };

        return redirect()->back()->with('success', "Status {$user->name} diubah menjadi {$statusLabel}.");
    }

    public function destroy(User $user)
    {
        $authUser = auth()->user();
        if ($authUser->role !== 'owner') {
            abort(403);
        }
        if (!in_array($user->role, ['admin', 'kasir', 'owner'], true)) {
            abort(404);
        }
        // Don't allow deleting owner
        if ($user->role === 'owner') {
            return redirect()->back()->with('error', 'Tidak dapat menghapus akun pemilik.');
        }

        $name = $user->name;
        $user->delete();

        return redirect()->back()->with('success', "Karyawan {$name} berhasil dihapus.");
    }
}
