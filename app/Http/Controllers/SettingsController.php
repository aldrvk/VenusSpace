<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function updateOperational(Request $request)
    {
        $validated = $request->validate([
            'operational_settings' => 'required|array',
        ]);

        Setting::set('operational_settings', $validated['operational_settings']);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => 'Pengaturan operasional berhasil disimpan.']);
        }

        return redirect()->back()->with('success', 'Pengaturan operasional berhasil disimpan.');
    }
}
