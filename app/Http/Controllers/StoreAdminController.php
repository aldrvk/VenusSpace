<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StoreOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class StoreAdminController extends Controller
{
    public function katalogCoffee()
    {
        $products = Product::where('unit', 'COFFEE SHOP')->get();
        return Inertia::render('Admin/KatalogCoffeeShop', [
            'products' => $products
        ]);
    }

    public function katalogVape()
    {
        $products = Product::where('unit', 'VAPE STORE')->get();
        return Inertia::render('Admin/KatalogVapeStore', [
            'products' => $products
        ]);
    }

    public function storeProduct(Request $request)
    {
        $request->validate([
            'unit'        => 'required|in:VAPE STORE,COFFEE SHOP',
            'name'        => 'required|string|max:255',
            'category'    => 'required|string|max:255',
            'price'       => 'required|integer|min:0',
            'stock'       => 'required|in:Tersedia,Habis,Terbatas',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'description' => 'nullable|string',
            'options'     => 'nullable|array',
        ]);

        $data = $request->except('image');

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
            'stock'       => 'required|in:Tersedia,Habis,Terbatas',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'description' => 'nullable|string',
            'options'     => 'nullable|array',
        ]);

        $data = $request->except('image');

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

    public function pesananStore()
    {
        $orders = StoreOrder::with('items')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/PesananStore', [
            'orders' => $orders
        ]);
    }

    public function confirmPayment(StoreOrder $order)
    {
        $order->update(['status' => 'BERHASIL']);
        return back()->with('success', 'Pembayaran berhasil dikonfirmasi.');
    }
}
