<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    // Simpan Produk Baru
    public function store(Request $request)
    {
        $product = Product::create([
            'id' => $request->id,
            'name' => $request->name,
            'price' => $request->price,
            'cost' => $request->cost,
            'stock' => $request->stock,
            'icon' => $request->icon,
            'category' => $request->category,
            'description' => $request->description
        ]);
        return response()->json(['status' => 'success', 'data' => $product]);
    }

    // Update Produk & Stok
    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if ($product) {
            $product->update($request->all());
            return response()->json(['status' => 'success', 'data' => $product]);
        }
        return response()->json(['status' => 'error'], 404);
    }

    // Hapus Produk
    public function destroy($id)
    {
        $product = Product::find($id);
        if ($product) {
            $product->delete();
            return response()->json(['status' => 'success']);
        }
        return response()->json(['status' => 'error'], 404);
    }

    public function syncProduct(Request $request) {
    // Logic: Jika ID ada, update. Jika tidak ada, buat baru.
    $product = Product::updateOrCreate(
        ['id' => $request->id],
        $request->only(['name', 'price', 'stock', 'category', 'icon', 'description'])
    );
    return response()->json(['status' => 'success', 'data' => $product]);
}
}
