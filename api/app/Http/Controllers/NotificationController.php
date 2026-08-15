<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // Mengambil notifikasi untuk user tertentu
    public function getNotifications($userId)
    {
        $notifications = Notification::where('user_id', $userId)
            ->orWhere('user_id', 'all')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    // Menandai satu notifikasi sebagai 'sudah dibaca'
    public function markAsRead($id)
    {
        $notification = Notification::find($id);
        if ($notification) {
            $notification->update(['is_read' => true]);
            return response()->json(['status' => 'success']);
        }
        return response()->json(['status' => 'error'], 404);
    }
}
