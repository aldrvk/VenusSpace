<?php

namespace App\Http\Controllers;

use App\Models\StoreOrder;
use App\Models\StoreOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StoreOrderController extends Controller
{
    /**
     * Create a new store order from customer checkout.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'unit'           => 'required|in:VAPE STORE,COFFEE SHOP',
            'customer_name'  => 'required|string|max:255',
            'payment_method' => 'required|in:cash,qris',
            'items'          => 'required|array|min:1',
            'items.*.name'   => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price'  => 'required|numeric|min:0',
        ]);

        $prefix = $validated['unit'] === 'VAPE STORE' ? 'VNX' : 'VNC';
        $orderCode = $prefix . '-' . strtoupper(Str::random(6));

        $total = collect($validated['items'])->sum(fn ($item) => $item['price'] * $item['quantity']);

        $order = StoreOrder::create([
            'order_code'     => $orderCode,
            'customer_name'  => $validated['customer_name'],
            'unit'           => $validated['unit'],
            'payment_method' => $validated['payment_method'],
            'total'          => $total,
            'status'         => $validated['payment_method'] === 'qris' ? 'BERHASIL' : 'MENUNGGU PEMBAYARAN',
        ]);

        foreach ($validated['items'] as $item) {
            StoreOrderItem::create([
                'store_order_id' => $order->id,
                'name'           => $item['name'],
                'quantity'       => $item['quantity'],
                'price'          => $item['price'],
            ]);
        }

        return response()->json([
            'order_code' => $orderCode,
            'order_id'   => $order->id,
        ]);
    }
}
