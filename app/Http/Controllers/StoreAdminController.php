<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StoreOrder;
use Illuminate\Http\Request;
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
            'unit'     => 'required|in:VAPE STORE,COFFEE SHOP',
            'name'     => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price'    => 'required|integer|min:0',
            'stock'    => 'required|in:Tersedia,Habis,Terbatas'
        ]);

        Product::create($request->all());

        return back()->with('success', 'Produk berhasil ditambahkan.');
    }

    public function updateProduct(Request $request, Product $product)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price'    => 'required|integer|min:0',
            'stock'    => 'required|in:Tersedia,Habis,Terbatas'
        ]);

        $product->update($request->all());

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
