<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TrainerController;
use App\Http\Controllers\PushNotificationController;
use App\Http\Controllers\BranchController;
use App\Models\Badge;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 🟢 LAPIS KEAMANAN: Rate Limiting (60 hit/menit) & API Key Auth
Route::middleware(['throttle:60,1', 'api.key'])->group(function () {

    // --- 1. GLOBAL & AUTH ---
    Route::get('/init-data', [BookingController::class, 'getInitialData']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'sendResetLink']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/user/update-profile', [ProfileController::class, 'updateProfile']);

    // --- 2. MEMBER ROUTES ---
    Route::post('/member/book-class', [BookingController::class, 'bookClass']);
    Route::post('/member/buy-product', [BookingController::class, 'buyProduct']);
    Route::post('/member/transfer-request', [TransferController::class, 'requestTransfer']);
    Route::post('/member/tickets', [TicketController::class, 'createTicket']);
    Route::post('/member/progress', [ProgressController::class, 'addProgress']);
    Route::post('/member/review', [TrainerController::class, 'submitReview']);

    // --- 3. TRAINER ROUTES ---
    Route::post('/trainer/shift', [TrainerController::class, 'toggleShift']);
    Route::post('/trainer/notes', [TrainerController::class, 'addClientNote']);
    Route::post('/trainer/attendance/{id}', [TrainerController::class, 'toggleAttendance']);

    // --- 4. ADMIN ROUTES ---
    // Classes
    Route::post('/admin/classes', [ClassController::class, 'addClass']);
    Route::put('/admin/classes/{id}', [ClassController::class, 'updateClass']);
    Route::post('/admin/classes/{id}/toggle', [ClassController::class, 'toggleClass']);

    // Products
    Route::post('/admin/products', [ProductController::class, 'store']);
    Route::put('/admin/products/{id}', [ProductController::class, 'update']);
    Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']);
    Route::post('/admin/products/{id}/stock', [AdminController::class, 'updateStock']);
    Route::post('/admin/products/{id}/photos', [AdminController::class, 'uploadPhotos']);

    // Finance & Verification
    Route::match(['get', 'post'], '/admin/verify-payment/{transaction_id}', [AdminController::class, 'approvePayment']);
    Route::get('/admin/finance-report', [FinanceController::class, 'getReport']);

    // Tickets & Transfers
    Route::post('/admin/transfer-action/{id}', [TransferController::class, 'processTransfer']);
    Route::post('/admin/tickets/{id}/reply', [TicketController::class, 'replyTicket']);
    Route::post('/admin/tickets/{id}/close', [TicketController::class, 'closeTicket']);
    Route::post('/admin/broadcasts', [AdminController::class, 'sendBroadcast']);

    // Badges (Direct Logic)
    Route::post('/admin/badges', function(\Illuminate\Http\Request $request) {
        $b = Badge::create($request->all());
        return response()->json(['status' => 'success', 'data' => $b]);
    });
    Route::put('/admin/badges/{id}', function(\Illuminate\Http\Request $request, $id) {
        $b = Badge::find($id);
        $b->update($request->all());
        return response()->json(['status' => 'success', 'data' => $b]);
    });
    Route::delete('/admin/badges/{id}', function($id) {
        Badge::destroy($id);
        return response()->json(['status' => 'success']);
    });

    // --- 5. NOTIFICATIONS ---
    Route::get('/notifications/{id}', [PushNotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [PushNotificationController::class, 'markAsRead']);

    // 1. Endpoint untuk React menyimpan token saat member login
    Route::post('/user/update-fcm', [PushNotificationController::class, 'saveToken']);

    // 2. Endpoint untuk testing kirim notifikasi (Bisa di-hit oleh Postman atau script Cronjob Anda nanti)
    Route::post('/admin/send-push', [PushNotificationController::class, 'sendPush']);

    Route::post('/admin/branches', [BranchController::class, 'store']);
    Route::put('/admin/branches/{id}', [BranchController::class, 'update']);
    Route::post('/admin/branches/{id}/toggle', [BranchController::class, 'toggleStatus']);

    Route::post('/admin/branches/{id}/settings', [AdminController::class, 'updateGymSettings']);

    Route::post('/admin/plans', [AdminController::class, 'savePlan']);
    Route::delete('/admin/plans/{id}', [AdminController::class, 'deletePlan']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

