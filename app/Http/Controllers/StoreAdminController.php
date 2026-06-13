<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StoreOrder;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class StoreAdminController extends Controller
{
    public function katalogCoffee(Request $request)
    {
        $query = Product::where('unit', 'COFFEE SHOP');
        
        $totalProducts = Product::where('unit', 'COFFEE SHOP')->count();
        $totalSold = Product::where('unit', 'COFFEE SHOP')->sum('sold');
        $outOfStock = Product::where('unit', 'COFFEE SHOP')->where('stock', 0)->count();
        $estRevenue = Product::where('unit', 'COFFEE SHOP')->selectRaw('SUM(price * sold) as total')->value('total') ?? 0;

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }
        if ($request->has('category') && $request->category != '' && $request->category != 'Semua') {
            $query->where('category', $request->category);
        }
        
        $products = $query->paginate(10)->withQueryString();
        $categories = Setting::get('coffee_categories', ['Kopi', 'Non-Kopi', 'Makanan']);
        
        return Inertia::render('Admin/KatalogCoffeeShop', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only('search', 'category'),
            'stats' => [
                'total_products' => $totalProducts,
                'total_sold' => $totalSold,
                'out_of_stock' => $outOfStock,
                'est_revenue' => (int)$estRevenue,
            ]
        ]);
    }

    public function katalogVape(Request $request)
    {
        $query = Product::where('unit', 'VAPE STORE');
        
        $totalProducts = Product::where('unit', 'VAPE STORE')->count();
        $totalSold = Product::where('unit', 'VAPE STORE')->sum('sold');
        $outOfStock = Product::where('unit', 'VAPE STORE')->where('stock', 0)->count();
        $estRevenue = Product::where('unit', 'VAPE STORE')->selectRaw('SUM(price * sold) as total')->value('total') ?? 0;

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }
        if ($request->has('category') && $request->category != '' && $request->category != 'Semua') {
            $query->where('category', $request->category);
        }
        
        $products = $query->paginate(10)->withQueryString();
        $categories = Setting::get('vape_categories', ['Device', 'Liquid', 'Accessories']);
        
        return Inertia::render('Admin/KatalogVapeStore', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only('search', 'category'),
            'stats' => [
                'total_products' => $totalProducts,
                'total_sold' => $totalSold,
                'out_of_stock' => $outOfStock,
                'est_revenue' => (int)$estRevenue,
            ]
        ]);
    }

    public function storeProduct(Request $request)
    {
        $request->validate([
            'unit'        => 'required|in:VAPE STORE,COFFEE SHOP',
            'name'        => 'required|string|max:255',
            'category'    => 'required|string|max:255',
            'price'       => 'required|integer|min:0',
            'stock'       => 'required|integer|min:0',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'description' => 'nullable|string',
            'options'     => 'nullable|array',
        ]);

        $data = $request->except(['image', 'add_stock']);

        if ($request->hasFile('image')) {
            $folder = $request->unit === 'VAPE STORE' ? 'Vape Store' : 'Coffee Shop';
            $imageName = strtolower($request->name) . '.' . $request->file('image')->getClientOriginalExtension();
            
            // Move file directly to public directory
            $destinationPath = public_path('images/' . $folder);
            if (!File::exists($destinationPath)) {
                File::makeDirectory($destinationPath, 0755, true);
            }
            
            $request->file('image')->move($destinationPath, $imageName);
            $data['image'] = '/images/' . $folder . '/' . $imageName;
        }

        Product::create($data);

        return back()->with('success', 'Produk berhasil ditambahkan.');
    }

    public function updateProduct(Request $request, Product $product)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'category'    => 'required|string|max:255',
            'price'       => 'required|integer|min:0',
            'add_stock'   => 'nullable|integer|min:0',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'description' => 'nullable|string',
            'options'     => 'nullable|array',
        ]);

        $data = $request->except(['image', 'add_stock']);

        if ($request->has('add_stock') && $request->add_stock > 0) {
            $data['stock'] = $product->stock + $request->add_stock;
        }

        if ($request->hasFile('image')) {
            $folder = $product->unit === 'VAPE STORE' ? 'Vape Store' : 'Coffee Shop';
            $imageName = strtolower($request->name) . '.' . $request->file('image')->getClientOriginalExtension();
            
            $destinationPath = public_path('images/' . $folder);
            if (!File::exists($destinationPath)) {
                File::makeDirectory($destinationPath, 0755, true);
            }
            
            // Delete old image if exists
            if ($product->image && File::exists(public_path($product->image))) {
                File::delete(public_path($product->image));
            }

            $request->file('image')->move($destinationPath, $imageName);
            $data['image'] = '/images/' . $folder . '/' . $imageName;
        }

        $product->update($data);

        return back()->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroyProduct(Product $product)
    {
        $product->delete();
        return back()->with('success', 'Produk berhasil dihapus.');
    }

    public function pesananStore(Request $request)
    {
        $query = StoreOrder::with('items')->orderBy('created_at', 'desc');

        // Filter berdasarkan unit kasir
        $user = auth()->user();
        if ($user->business_unit === 'vape_store') {
            $query->where('unit', 'VAPE STORE');
        } elseif ($user->business_unit === 'coffee_shop') {
            $query->where('unit', 'COFFEE SHOP');
        }

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('order_code', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%");
            });
        }

        $orders = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/PesananStore', [
            'orders' => $orders,
            'filters' => $request->only('search')
        ]);
    }

    public function confirmPayment(StoreOrder $order)
    {
        $order->update([
            'status' => 'BERHASIL',
            'progress_status' => 'pending'
        ]);
        return back()->with('success', 'Pembayaran berhasil dikonfirmasi.');
    }

    public function updateProgress(Request $request, StoreOrder $order)
    {
        $request->validate([
            'progress_status' => 'required|in:pending,processing,ready,completed',
        ]);

        $oldStatus = $order->progress_status;
        $newStatus = $request->progress_status;

        $updateData = ['progress_status' => $request->progress_status];
        if ($request->progress_status === 'completed') {
            $updateData['done_at'] = now();
            $updateData['status'] = 'BERHASIL';
        }

        $order->update($updateData);

        // If transitioning to completed, increment sold count of products
        if ($newStatus === 'completed' && $oldStatus !== 'completed') {
            foreach ($order->items as $item) {
                $product = Product::where('name', $item->name)
                    ->where('unit', $order->unit)
                    ->first();
                if ($product) {
                    $product->increment('sold', $item->quantity);
                }
            }
        }

        return back()->with('success', 'Status pesanan berhasil diperbarui.');
    }

    public function cancelOrder(Request $request, StoreOrder $order)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        if ($order->unit === 'COFFEE SHOP' && $order->progress_status !== 'menunggu_pembayaran') {
            return back()->with('error', 'Pesanan Coffee Shop yang sudah dikonfirmasi tidak dapat dibatalkan.');
        }

        $oldStatus = $order->progress_status;

        $order->update([
            'progress_status' => 'cancelled',
            'admin_notes' => $request->reason,
            'done_at' => now(),
        ]);

        // Refund stock and update sold count
        foreach ($order->items as $item) {
            $product = Product::where('name', $item->name)
                ->where('unit', $order->unit)
                ->first();
            if ($product) {
                $product->increment('stock', $item->quantity);
                if ($oldStatus === 'completed') {
                    $product->decrement('sold', $item->quantity);
                }
            }
        }

        return back()->with('success', 'Pesanan berhasil dibatalkan.');
    }

    public function updateCategories(Request $request)
    {
        $request->validate([
            'unit' => 'required|in:VAPE STORE,COFFEE SHOP',
            'categories' => 'required|array',
            'categories.*' => 'string|max:255'
        ]);

        $key = $request->unit === 'VAPE STORE' ? 'vape_categories' : 'coffee_categories';
        Setting::set($key, $request->categories);

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function updateDisplaySettings(Request $request)
    {
        $request->validate([
            'unit' => 'required|in:VAPE STORE,COFFEE SHOP',
            'show_stock' => 'required|boolean',
        ]);

        $key = $request->unit === 'VAPE STORE' ? 'show_stock_vape_store' : 'show_stock_coffee_shop';
        Setting::set($key, (bool) $request->show_stock);

        return back()->with('success', 'Pengaturan tampilan stok berhasil diperbarui.');
    }

    public function walkIn(Request $request)
    {
        $user = auth()->user();
        $unit = $user->business_unit;
        
        $productUnit = $unit === 'vape_store' ? 'VAPE STORE' : ($unit === 'coffee_shop' ? 'COFFEE SHOP' : null);
        
        if (!$productUnit) {
            abort(403, 'Akses ditolak. Hanya Kasir Toko yang dapat mengakses menu ini.');
        }
        
        $products = Product::where('unit', $productUnit)
            ->where('stock', '>', 0)
            ->get();
            
        $categories = $unit === 'vape_store' 
            ? Setting::get('vape_categories', ['Device', 'Liquid', 'Accessories'])
            : Setting::get('coffee_categories', ['Kopi', 'Non-Kopi', 'Makanan']);
            
        $unitLabel = $unit === 'vape_store' ? 'Vape Store' : 'Coffee Shop';

        return Inertia::render('Admin/StoreWalkIn', [
            'products' => $products,
            'categories' => $categories,
            'unit' => $productUnit,
            'unitLabel' => $unitLabel,
        ]);
    }

    public function storeWalkIn(Request $request)
    {
        $user = auth()->user();
        $unit = $user->business_unit;
        $productUnit = $unit === 'vape_store' ? 'VAPE STORE' : ($unit === 'coffee_shop' ? 'COFFEE SHOP' : null);
        
        if (!$productUnit) {
            abort(403, 'Akses ditolak.');
        }

        $request->validate([
            'customer_name' => 'required|string|max:50',
            'payment_method' => 'required|in:cash,qris',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $items = $request->items;
        $total = 0;
        
        $validatedItems = [];
        foreach ($items as $itemData) {
            $product = Product::findOrFail($itemData['id']);
            
            if ($product->unit !== $productUnit) {
                abort(400, "Produk {$product->name} bukan bagian dari unit usaha Anda.");
            }
            
            if ($product->stock < $itemData['quantity']) {
                return back()->with('error', "Stok untuk produk {$product->name} tidak mencukupi (Tersedia: {$product->stock}).");
            }
            
            $total += $product->price * $itemData['quantity'];
            $validatedItems[] = [
                'product' => $product,
                'quantity' => $itemData['quantity'],
                'price' => $product->price
            ];
        }

        $order = StoreOrder::create([
            'order_code' => ($productUnit === 'VAPE STORE' ? 'VP-' : 'CF-') . strtoupper(\Illuminate\Support\Str::random(5)),
            'user_id' => $user->id,
            'customer_name' => $request->customer_name,
            'unit' => $productUnit,
            'total' => $total,
            'payment_method' => $request->payment_method,
            'status' => 'BERHASIL',
            'progress_status' => 'completed',
            'done_at' => now(),
        ]);

        foreach ($validatedItems as $vItem) {
            $product = $vItem['product'];
            $qty = $vItem['quantity'];
            
            $order->items()->create([
                'name'     => $product->name,
                'quantity' => $qty,
                'price'    => $product->price,
            ]);
            
            $product->decrement('stock', $qty);
            $product->increment('sold', $qty);
        }

        return redirect()->route('admin.pesanan-store')->with('success', "Transaksi walk-in {$order->order_code} berhasil diproses.");
    }
}
