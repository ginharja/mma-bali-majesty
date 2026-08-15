<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Branch;

class BranchController extends Controller
{
    public function store(Request $request)
    {
        try {
            $data = $request->all();

            // Simpan ke database (Jika ID sudah ada, dia Update. Jika belum, dia Create)
            $branch = Branch::updateOrCreate(
                ['id' => $request->id],
                $data
            );

            return response()->json(['status' => 'success', 'data' => $branch]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            // Abaikan primary key 'id' saat proses update agar tidak ditolak MySQL
            $data = $request->except(['id']);

            $branch = Branch::updateOrCreate(
                ['id' => $id],
                $data
            );

            return response()->json(['status' => 'success', 'data' => $branch]);
        } catch (\Exception $e) {
            // Mengirimkan pesan error asli ke Frontend jika terjadi kegagalan
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function toggleStatus($id)
    {
        $branch = Branch::find($id);
        if ($branch) {
            $branch->status = $branch->status === 'active' ? 'inactive' : 'active';
            $branch->save();
            return response()->json(['status' => 'success', 'data' => $branch]);
        }
        return response()->json(['status' => 'error', 'message' => 'Branch not found'], 404);
    }
}
