<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\StoreOrder;
use App\Models\StoreOrderItem;

class StoreSeeder extends Seeder
{
    public function run()
    {
        Product::truncate();
        Product::create(['unit' => 'VAPE STORE', 'name' => 'Lost Mary BM600', 'category' => 'Device', 'price' => 85000, 'stock' => 'Tersedia', 'sold' => 24]);
        Product::create(['unit' => 'VAPE STORE', 'name' => 'Vaporesso XROS 3', 'category' => 'Device', 'price' => 350000, 'stock' => 'Tersedia', 'sold' => 8]);
        Product::create(['unit' => 'VAPE STORE', 'name' => 'SMOK Nord 5', 'category' => 'Device', 'price' => 420000, 'stock' => 'Terbatas', 'sold' => 3]);
        Product::create(['unit' => 'VAPE STORE', 'name' => 'Elfbar BC5000', 'category' => 'Device', 'price' => 95000, 'stock' => 'Habis', 'sold' => 0]);
        Product::create(['unit' => 'VAPE STORE', 'name' => 'Saltnic Mnke Punch 30ml', 'category' => 'Liquid', 'price' => 55000, 'stock' => 'Tersedia', 'sold' => 40]);
        
        Product::create(['unit' => 'COFFEE SHOP', 'name' => 'Americano', 'category' => 'Kopi', 'price' => 18000, 'stock' => 'Tersedia', 'sold' => 42]);
        Product::create(['unit' => 'COFFEE SHOP', 'name' => 'Cappuccino', 'category' => 'Kopi', 'price' => 22000, 'stock' => 'Tersedia', 'sold' => 38]);
        Product::create(['unit' => 'COFFEE SHOP', 'name' => 'Matcha Latte', 'category' => 'Non-Kopi', 'price' => 25000, 'stock' => 'Terbatas', 'sold' => 20]);
        Product::create(['unit' => 'COFFEE SHOP', 'name' => 'Croissant', 'category' => 'Makanan', 'price' => 20000, 'stock' => 'Habis', 'sold' => 14]);

        StoreOrderItem::query()->delete();
        StoreOrder::query()->delete();
        
        $order1 = StoreOrder::create(['order_code' => 'VNX-823412', 'customer_name' => 'Budi Santoso', 'unit' => 'VAPE STORE', 'payment_method' => 'cash', 'total' => 570000, 'status' => 'MENUNGGU PEMBAYARAN']);
        $order1->items()->create(['name' => 'Oxva Xlim Pro', 'quantity' => 1, 'price' => 350000]);
        $order1->items()->create(['name' => 'Liquid Blackcurrant', 'quantity' => 2, 'price' => 110000]);

        $order2 = StoreOrder::create(['order_code' => 'VNC-912384', 'customer_name' => 'Siska Amelia', 'unit' => 'COFFEE SHOP', 'payment_method' => 'qris', 'total' => 115000, 'status' => 'BERHASIL']);
        $order2->items()->create(['name' => 'Caramel Macchiato', 'quantity' => 2, 'price' => 45000]);
    }
}
