<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SupportTicket;
use App\Models\Notification;

class TicketController extends Controller
{
    // Member: Buat Tiket Baru
    public function createTicket(Request $request)
    {
        $ticket = SupportTicket::create([
            'id' => $request->id,
            'user_id' => $request->user_id,
            'user_name' => $request->user_name,
            'subject' => $request->subject,
            'message' => $request->message,
            'status' => 'open',
            'replies' => [], // Array kosong saat pertama dibuat
            'date' => $request->date
        ]);
        return response()->json(['status' => 'success', 'data' => $ticket]);
    }

    // Admin: Balas Tiket
    public function replyTicket(Request $request, $id)
{
    $ticket = SupportTicket::find($id);
    if ($ticket) {
        $replies = $ticket->replies ?? [];

        // Tambahkan balasan baru
        $replies[] = [
            'from' => $request->from, // Bisa 'admin' atau 'member'
            'text' => $request->text,
            'time' => date('c')
        ];

        $ticket->replies = $replies;
        $ticket->status = ($request->from === 'admin') ? 'replied' : 'open';
        $ticket->save();

        if ($request->from === 'admin') {
        Notification::create([
            'user_id' => $ticket->user_id,
            'type'    => 'support',
            'title'   => 'New Support Reply',
            'message' => 'Admin has responded to: ' . $ticket->subject,
            'is_read' => false
        ]);
    }

        // Kembalikan data tiket terbaru agar React bisa langsung update UI
        return response()->json(['status' => 'success', 'data' => $ticket]);
    }
    return response()->json(['status' => 'error'], 404);
}

    // Admin: Tutup Tiket
    public function closeTicket($id)
    {
        $ticket = SupportTicket::find($id);
        if ($ticket) {
            $ticket->status = 'closed';
            $ticket->save();
            return response()->json(['status' => 'success']);
        }
        return response()->json(['status' => 'error'], 404);
    }
}
