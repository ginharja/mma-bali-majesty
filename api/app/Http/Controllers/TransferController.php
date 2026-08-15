<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transfer;
use App\Models\User;

class TransferController extends Controller
{
    // API Member: Kirim Request Pindah
    public function requestTransfer(Request $request)
    {
        $transfer = Transfer::create($request->all());
        return response()->json(['status' => 'success', 'data' => $transfer]);
    }

    // API Admin: Setujui atau Tolak
    public function processTransfer(Request $request, $id)
    {
        $transfer = Transfer::find($id);
        if ($transfer) {
            $transfer->status = $request->action; // 'approved' atau 'rejected'
            $transfer->save();

            // Jika disetujui, langsung ganti cabang user di database
            if ($request->action === 'approved') {
                $user = User::find($transfer->user_id);
                if ($user) {
                    $user->branch_id = $transfer->to_branch_id;
                    $user->save();
                }
            }
            return response()->json(['status' => 'success']);
        }
        return response()->json(['status' => 'error', 'message' => 'Data tidak ditemukan'], 404);
    }
}
