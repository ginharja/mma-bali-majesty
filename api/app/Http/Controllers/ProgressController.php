<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FitnessProgress;

class ProgressController extends Controller
{
    public function addProgress(Request $request)
    {
        $progress = FitnessProgress::create([
            'id' => $request->id,
            'user_id' => $request->user_id,
            'weight' => $request->weight,
            'note' => $request->note,
            'date' => $request->date
        ]);

        return response()->json(['status' => 'success', 'data' => $progress]);
    }
}
