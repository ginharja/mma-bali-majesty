<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Product;
use App\Models\GymClass;
use App\Models\Booking;
use App\Models\SupportTicket;
use App\Models\Transfer;
use App\Models\FitnessProgress;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use App\Models\Badge;
use App\Models\Notification;
use App\Models\TrainerLog;
use App\Models\ClientNote;
use App\Models\Review;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        User::truncate();
        Product::truncate();
        GymClass::truncate();
        Booking::truncate();
        SupportTicket::truncate();
        Transfer::truncate();
        FitnessProgress::truncate();
        Schema::enableForeignKeyConstraints();
        // ====================================================================
        // 1. DATA PENGGUNA (ADMIN, TRAINER, MEMBER)
        // ====================================================================
        $users = [
            ['id' => 1, 'name'=>'Super Admin', 'email'=>'admin@gym.com', 'password'=>Hash::make('123'), 'role'=>'admin', 'avatar'=>'🛡️', 'plan'=>null, 'branch_id'=>null, 'streak'=>0, 'join_date'=>null, 'spend'=>0, 'total_classes'=>0, 'phone'=>'+62 811-0000-0001', 'dob'=>'01 Jan 1985', 'address'=>'HQ RAW Gym, Bali', 'emergency_contact'=>null, 'status'=>'active'],
            ['id' => 2, 'name'=>'Coach Hendra', 'email'=>'coach@gym.com', 'password'=>Hash::make('123'), 'role'=>'trainer', 'avatar'=>'🏋️', 'plan'=>null, 'branch_id'=>'B1', 'streak'=>0, 'spend'=>0, 'total_classes'=>0, 'phone'=>'+62 878-1111-2222', 'address'=>'Uluwatu', 'trainer_id'=>'T1', 'status'=>'active'],
            ['id' => 3, 'name'=>'Sari Wijaya', 'email'=>'sari@gym.com', 'password'=>Hash::make('123'), 'role'=>'trainer', 'avatar'=>'🧘', 'plan'=>null, 'branch_id'=>'B1', 'streak'=>0, 'spend'=>0, 'total_classes'=>0, 'phone'=>'+62 815-2222-3333', 'address'=>'Seminyak', 'trainer_id'=>'T2', 'status'=>'active'],
            ['id' => 4, 'name'=>'Reza Kurnia', 'email'=>'reza@gym.com', 'password'=>Hash::make('123'), 'role'=>'trainer', 'avatar'=>'🥊', 'plan'=>null, 'branch_id'=>'B2', 'streak'=>0, 'spend'=>0, 'total_classes'=>0, 'phone'=>'+62 819-3333-4444', 'address'=>'Canggu', 'trainer_id'=>'T3', 'status'=>'active'],
            ['id' => 5, 'name'=>'Luna Sari', 'email'=>'luna@gym.com', 'password'=>Hash::make('123'), 'role'=>'trainer', 'avatar'=>'⚡', 'plan'=>null, 'branch_id'=>'B2', 'streak'=>0, 'spend'=>0, 'total_classes'=>0, 'phone'=>'+62 822-4444-5555', 'address'=>'Berawa', 'trainer_id'=>'T4', 'status'=>'active'],
            ['id' => 6, 'name'=>'Master Beni', 'email'=>'beni@gym.com', 'password'=>Hash::make('123'), 'role'=>'trainer', 'avatar'=>'🥋', 'plan'=>null, 'branch_id'=>'B1', 'streak'=>0, 'spend'=>0, 'total_classes'=>0, 'phone'=>'+62 812-9999-8888', 'address'=>'Uluwatu', 'trainer_id'=>'T5', 'status'=>'active'],
            ['id' => 7, 'name'=>'Dewi Rahayu', 'email'=>'dewi@gym.com', 'password'=>Hash::make('123'), 'role'=>'trainer', 'avatar'=>'💃', 'plan'=>null, 'branch_id'=>'B3', 'streak'=>0, 'spend'=>0, 'total_classes'=>0, 'phone'=>'+62 831-6666-7777', 'address'=>'Berawa', 'trainer_id'=>'T6', 'status'=>'active'],
            ['id' => 8, 'name'=>'Andi Setiawan', 'email'=>'andi@gym.com', 'password'=>Hash::make('123'), 'role'=>'trainer', 'avatar'=>'💪', 'plan'=>null, 'branch_id'=>'B4', 'streak'=>0, 'spend'=>0, 'total_classes'=>0, 'phone'=>'+62 858-7777-8888', 'address'=>'Ubud', 'trainer_id'=>'T7', 'status'=>'active'],
            ['id' => 9, 'name'=>'Maya Lestari', 'email'=>'maya@gym.com', 'password'=>Hash::make('123'), 'role'=>'trainer', 'avatar'=>'🌿', 'plan'=>null, 'branch_id'=>'B4', 'streak'=>0, 'spend'=>0, 'total_classes'=>0, 'phone'=>'+62 813-8888-9999', 'address'=>'Ubud', 'trainer_id'=>'T8', 'status'=>'active'],
            ['id' => 10, 'name'=>'Alex Fitria', 'email'=>'alex@gym.com', 'password'=>Hash::make('123'), 'role'=>'member', 'avatar'=>'🧑‍🎤', 'plan'=>'Monthly', 'branch_id'=>'B1', 'streak'=>17, 'join_date'=>'25 Mar 2024', 'spend'=>1250000, 'total_classes'=>14, 'phone'=>'+62 812-3456-7890', 'dob'=>'15 Mar 1995', 'address'=>'Seminyak', 'status'=>'active'],
            ['id' => 11, 'name'=>'Rina Dewi', 'email'=>'rina@gym.com', 'password'=>Hash::make('123'), 'role'=>'member', 'avatar'=>'👩‍🎤', 'plan'=>'Annual', 'branch_id'=>'B2', 'streak'=>14, 'join_date'=>'22 Aug 2024', 'spend'=>3200000, 'total_classes'=>47, 'phone'=>'+62 821-5678-9012', 'dob'=>'22 Aug 1992', 'address'=>'Canggu', 'status'=>'active'],
            ['id' => 12, 'name'=>'Budi Santoso', 'email'=>'budi@gym.com', 'password'=>Hash::make('123'), 'role'=>'member', 'avatar'=>'🧑', 'plan'=>'Monthly', 'branch_id'=>'B1', 'streak'=>2, 'join_date'=>'20 Mar 2025', 'spend'=>350000, 'total_classes'=>4, 'status'=>'active'],
            ['id' => 13, 'name'=>'Citra Kirana', 'email'=>'citra@gym.com', 'password'=>Hash::make('123'), 'role'=>'member', 'avatar'=>'👩', 'plan'=>'Per Visit', 'branch_id'=>'B2', 'streak'=>0, 'join_date'=>'10 Jan 2025', 'spend'=>150000, 'total_classes'=>2, 'status'=>'inactive'],
            ['id' => 14, 'name'=>'Dodi Pratama', 'email'=>'dodi@gym.com', 'password'=>Hash::make('123'), 'role'=>'member', 'avatar'=>'👨', 'plan'=>'Quarterly', 'branch_id'=>'B3', 'streak'=>5, 'join_date'=>'22 Dec 2023', 'spend'=>900000, 'total_classes'=>20, 'status'=>'active'],
            ['id' => 15, 'name'=>'Eka Putri', 'email'=>'eka@gym.com', 'password'=>Hash::make('123'), 'role'=>'member', 'avatar'=>'👱‍♀️', 'plan'=>'Annual', 'branch_id'=>'B4', 'streak'=>12, 'spend'=>3000000, 'total_classes'=>50, 'status'=>'active'],
            ['id' => 16, 'name'=>'Fajar Nugraha', 'email'=>'fajar@gym.com', 'password'=>Hash::make('123'), 'role'=>'member', 'avatar'=>'🧔', 'plan'=>'Monthly', 'branch_id'=>'B1', 'streak'=>0, 'spend'=>350000, 'total_classes'=>1, 'status'=>'inactive'],
            ['id' => 17, 'name'=>'Gita Savitri', 'email'=>'gita@gym.com', 'password'=>Hash::make('123'), 'role'=>'member', 'avatar'=>'🧕', 'plan'=>'Monthly', 'branch_id'=>'B2', 'streak'=>3, 'spend'=>700000, 'total_classes'=>15, 'status'=>'active'],
        ];
        foreach ($users as $user) { User::create($user); }

        // ====================================================================
        // 2. DATA PRODUK (20 ITEM TOKO + 5 EVENT)
        // ====================================================================
        $products = [
            ['id' => 'P1', 'name' => 'Oversized RAW Tee', 'price' => 250000, 'cost' => 120000, 'stock' => 55, 'icon' => '👕', 'category' => 'Merchandise', 'description' => 'Premium cotton.'],
            ['id' => 'P2', 'name' => 'RAW Gym Bag', 'price' => 450000, 'cost' => 220000, 'stock' => 30, 'icon' => '🎒', 'category' => 'Merchandise', 'description' => 'Durable gym bag.'],
            ['id' => 'P3', 'name' => 'RAW Cap', 'price' => 150000, 'cost' => 60000, 'stock' => 60, 'icon' => '🧢', 'category' => 'Merchandise', 'description' => 'Snapback cap.'],
            ['id' => 'P4', 'name' => 'RAW Hoodie Pro', 'price' => 550000, 'cost' => 300000, 'stock' => 20, 'icon' => '🧥', 'category' => 'Merchandise', 'description' => 'Warm up hoodie.'],
            ['id' => 'P5', 'name' => 'Gym Towel Microfiber', 'price' => 90000, 'cost' => 40000, 'stock' => 100, 'icon' => '🧻', 'category' => 'Merchandise', 'description' => 'Quick dry.'],
            ['id' => 'P6', 'name' => 'RAW Whey Isolate', 'price' => 850000, 'cost' => 600000, 'stock' => 85, 'icon' => '🥤', 'category' => 'Supplements', 'description' => '25g protein per serving.'],
            ['id' => 'P7', 'name' => 'Pre-Workout Monster', 'price' => 450000, 'cost' => 310000, 'stock' => 40, 'icon' => '⚡', 'category' => 'Supplements', 'description' => 'High-stim pre-workout.'],
            ['id' => 'P8', 'name' => 'BCAA Recovery', 'price' => 320000, 'cost' => 200000, 'stock' => 50, 'icon' => '💊', 'category' => 'Supplements', 'description' => 'Essential amino acids.'],
            ['id' => 'P9', 'name' => 'Creatine Monohydrate', 'price' => 250000, 'cost' => 150000, 'stock' => 60, 'icon' => '💪', 'category' => 'Supplements', 'description' => 'Pure creatine 5g/serving.'],
            ['id' => 'P10', 'name' => 'Mass Gainer Elite', 'price' => 950000, 'cost' => 700000, 'stock' => 15, 'icon' => '🏋️', 'category' => 'Supplements', 'description' => '1000 kcal per serving.'],
            ['id' => 'P11', 'name' => 'RAW Lifting Belt', 'price' => 650000, 'cost' => 400000, 'stock' => 25, 'icon' => '🏋️', 'category' => 'Equipment', 'description' => 'Leather powerlifting belt.'],
            ['id' => 'P12', 'name' => 'Resistance Bands Set', 'price' => 280000, 'cost' => 130000, 'stock' => 40, 'icon' => '🔴', 'category' => 'Equipment', 'description' => '5-band set.'],
            ['id' => 'P13', 'name' => 'Speed Jump Rope', 'price' => 180000, 'cost' => 80000, 'stock' => 50, 'icon' => '🪢', 'category' => 'Equipment', 'description' => 'Ball-bearing handles.'],
            ['id' => 'P14', 'name' => 'Boxing Gloves 14oz', 'price' => 750000, 'cost' => 450000, 'stock' => 10, 'icon' => '🥊', 'category' => 'Equipment', 'description' => 'Premium sparring gloves.'],
            ['id' => 'P15', 'name' => 'Yoga Mat Pro', 'price' => 350000, 'cost' => 150000, 'stock' => 35, 'icon' => '🧘', 'category' => 'Equipment', 'description' => 'Non-slip 5mm mat.'],
            ['id' => 'P16', 'name' => 'Protein Smoothie', 'price' => 55000, 'cost' => 20000, 'stock' => 999, 'icon' => '🥛', 'category' => 'F&B', 'description' => 'Fresh blended smoothie.'],
            ['id' => 'P17', 'name' => 'Açaí Bowl', 'price' => 65000, 'cost' => 28000, 'stock' => 999, 'icon' => '🍇', 'category' => 'F&B', 'description' => 'With granola & honey.'],
            ['id' => 'P18', 'name' => 'Cold Brew Coffee', 'price' => 40000, 'cost' => 12000, 'stock' => 999, 'icon' => '☕', 'category' => 'F&B', 'description' => '18-hour cold brew.'],
            ['id' => 'P19', 'name' => 'Mineral Water 1L', 'price' => 15000, 'cost' => 5000, 'stock' => 999, 'icon' => '💧', 'category' => 'F&B', 'description' => 'Stay hydrated.'],
            ['id' => 'P20', 'name' => 'Protein Bar', 'price' => 35000, 'cost' => 15000, 'stock' => 120, 'icon' => '🍫', 'category' => 'F&B', 'description' => '20g protein snack.'],
            ['id' => 'E1', 'name' => 'RAW Throwdown 2026', 'price' => 350000, 'cost' => 50000, 'stock' => 100, 'icon' => '🏆', 'category' => 'Events', 'description' => 'Annual fitness competition.'],
            ['id' => 'E2', 'name' => 'Nutrition Workshop', 'price' => 200000, 'cost' => 30000, 'stock' => 50, 'icon' => '🥗', 'category' => 'Events', 'description' => 'Learn macros & diets.'],
            ['id' => 'E3', 'name' => 'Yoga Retreat Pass', 'price' => 1500000, 'cost' => 800000, 'stock' => 20, 'icon' => '🌅', 'category' => 'Events', 'description' => 'Weekend getaway in Ubud.'],
            ['id' => 'E4', 'name' => 'Boxing Seminar', 'price' => 250000, 'cost' => 50000, 'stock' => 40, 'icon' => '🥊', 'category' => 'Events', 'description' => 'Technique clinic with Pro.'],
            ['id' => 'E5', 'name' => 'Beach Bootcamp', 'price' => 100000, 'cost' => 20000, 'stock' => 80, 'icon' => '🏖️', 'category' => 'Events', 'description' => 'Sunday morning at Canggu.'],
        ];
        foreach ($products as $product) { Product::create($product); }

        // ====================================================================
        // 3. JADWAL KELAS 7 HARI (Berbeda setiap hari + Online)
        // ====================================================================
        $classes = [
            ['id'=>'C101', 'branch_id'=>'B1', 'name'=>'HIIT INFERNO', 'trainer_id'=>'T1', 'time'=>'06:00', 'day'=>'Mon', 'duration'=>'45 min', 'slots'=>5, 'total'=>15, 'icon'=>'🔥', 'intensity'=>'HIGH', 'category'=>'HIIT', 'color'=>'#FF3131', 'status'=>'active'],
            ['id'=>'C102', 'branch_id'=>'B2', 'name'=>'YOGA FLOW', 'trainer_id'=>'T2', 'time'=>'07:30', 'day'=>'Mon', 'duration'=>'60 min', 'slots'=>8, 'total'=>12, 'icon'=>'🧘', 'intensity'=>'LOW', 'category'=>'Yoga', 'color'=>'#B39DDB', 'status'=>'active'],
            ['id'=>'C103', 'branch_id'=>'B3', 'name'=>'BOXING PRO', 'trainer_id'=>'T3', 'time'=>'17:00', 'day'=>'Mon', 'duration'=>'60 min', 'slots'=>2, 'total'=>10, 'icon'=>'🥊', 'intensity'=>'HIGH', 'category'=>'Boxing', 'color'=>'#FF3131', 'status'=>'active'],
            // Kelas Online dengan Youtube Link agar Video Player di React berfungsi!
            ['id'=>'CO10', 'branch_id'=>'ONLINE', 'name'=>'VIRTUAL BASIC MARTIAL ARTS', 'trainer_id'=>'T5', 'time'=>'19:00', 'day'=>'Mon', 'duration'=>'60 min', 'slots'=>90, 'total'=>100, 'icon'=>'💻', 'intensity'=>'MED', 'category'=>'Boxing', 'color'=>'#4FC3F7', 'status'=>'active', 'video_url'=>'https://www.youtube.com/watch?v=inpok4MKVLM'],

            ['id'=>'C201', 'branch_id'=>'B4', 'name'=>'STRENGTH BEAST', 'trainer_id'=>'T7', 'time'=>'08:00', 'day'=>'Tue', 'duration'=>'60 min', 'slots'=>1, 'total'=>10, 'icon'=>'🏋️', 'intensity'=>'HIGH', 'category'=>'Strength', 'color'=>'#FF5C00', 'status'=>'active'],
            ['id'=>'C202', 'branch_id'=>'B2', 'name'=>'PILATES SCULPT', 'trainer_id'=>'T4', 'time'=>'10:00', 'day'=>'Tue', 'duration'=>'50 min', 'slots'=>5, 'total'=>15, 'icon'=>'🧘', 'intensity'=>'MED', 'category'=>'Pilates', 'color'=>'#B39DDB', 'status'=>'active'],
            ['id'=>'C203', 'branch_id'=>'B1', 'name'=>'ZUMBA PARTY', 'trainer_id'=>'T6', 'time'=>'18:00', 'day'=>'Tue', 'duration'=>'60 min', 'slots'=>15, 'total'=>30, 'icon'=>'💃', 'intensity'=>'MED', 'category'=>'Dance', 'color'=>'#FFD700', 'status'=>'active'],
            // Kelas Online dengan Zoom Link
            ['id'=>'CO20', 'branch_id'=>'ONLINE', 'name'=>'VIRTUAL YOGA', 'trainer_id'=>'T2', 'time'=>'07:00', 'day'=>'Tue', 'duration'=>'45 min', 'slots'=>40, 'total'=>50, 'icon'=>'💻', 'intensity'=>'LOW', 'category'=>'Yoga', 'color'=>'#4FC3F7', 'status'=>'active', 'video_url'=>'https://zoom.us/j/tue123'],

            ['id'=>'C301', 'branch_id'=>'B1', 'name'=>'SAVATE KICKBOXING', 'trainer_id'=>'T5', 'time'=>'16:00', 'day'=>'Wed', 'duration'=>'90 min', 'slots'=>10, 'total'=>20, 'icon'=>'🥊', 'intensity'=>'HIGH', 'category'=>'Boxing', 'color'=>'#FF5C00', 'status'=>'active'],
            ['id'=>'C302', 'branch_id'=>'B3', 'name'=>'CORE CRUSHER', 'trainer_id'=>'T4', 'time'=>'09:00', 'day'=>'Wed', 'duration'=>'45 min', 'slots'=>6, 'total'=>15, 'icon'=>'⚡', 'intensity'=>'MED', 'category'=>'Pilates', 'color'=>'#CCFF00', 'status'=>'active'],
            ['id'=>'C303', 'branch_id'=>'B4', 'name'=>'MOBILITY FLOW', 'trainer_id'=>'T8', 'time'=>'17:30', 'day'=>'Wed', 'duration'=>'60 min', 'slots'=>12, 'total'=>20, 'icon'=>'🌿', 'intensity'=>'LOW', 'category'=>'Yoga', 'color'=>'#00FF85', 'status'=>'active'],
            ['id'=>'CO30', 'branch_id'=>'ONLINE', 'name'=>'VIRTUAL HIIT', 'trainer_id'=>'T1', 'time'=>'19:00', 'day'=>'Wed', 'duration'=>'45 min', 'slots'=>80, 'total'=>100, 'icon'=>'💻', 'intensity'=>'HIGH', 'category'=>'HIIT', 'color'=>'#4FC3F7', 'status'=>'active', 'video_url'=>'https://zoom.us/j/wed123'],

            ['id'=>'C401', 'branch_id'=>'B2', 'name'=>'POWER LIFT', 'trainer_id'=>'T7', 'time'=>'07:00', 'day'=>'Thu', 'duration'=>'60 min', 'slots'=>3, 'total'=>8, 'icon'=>'🏋️', 'intensity'=>'HIGH', 'category'=>'Strength', 'color'=>'#FFD700', 'status'=>'active'],
            ['id'=>'C402', 'branch_id'=>'B1', 'name'=>'MUAY THAI', 'trainer_id'=>'T3', 'time'=>'18:00', 'day'=>'Thu', 'duration'=>'60 min', 'slots'=>4, 'total'=>12, 'icon'=>'🥊', 'intensity'=>'HIGH', 'category'=>'Boxing', 'color'=>'#FF3131', 'status'=>'active'],
            ['id'=>'CO40', 'branch_id'=>'ONLINE', 'name'=>'VIRTUAL PILATES', 'trainer_id'=>'T4', 'time'=>'08:00', 'day'=>'Thu', 'duration'=>'50 min', 'slots'=>30, 'total'=>50, 'icon'=>'💻', 'intensity'=>'MED', 'category'=>'Pilates', 'color'=>'#4FC3F7', 'status'=>'active', 'video_url'=>'https://zoom.us/j/thu123'],

            ['id'=>'C501', 'branch_id'=>'B3', 'name'=>'FUNCTIONAL FIT', 'trainer_id'=>'T1', 'time'=>'06:30', 'day'=>'Fri', 'duration'=>'50 min', 'slots'=>5, 'total'=>15, 'icon'=>'⚡', 'intensity'=>'HIGH', 'category'=>'HIIT', 'color'=>'#00FF85', 'status'=>'active'],
            ['id'=>'C502', 'branch_id'=>'B4', 'name'=>'VINYASA YOGA', 'trainer_id'=>'T8', 'time'=>'16:00', 'day'=>'Fri', 'duration'=>'60 min', 'slots'=>10, 'total'=>20, 'icon'=>'🧘', 'intensity'=>'LOW', 'category'=>'Yoga', 'color'=>'#B39DDB', 'status'=>'active'],
            ['id'=>'CO50', 'branch_id'=>'ONLINE', 'name'=>'VIRTUAL STRENGTH', 'trainer_id'=>'T7', 'time'=>'19:00', 'day'=>'Fri', 'duration'=>'45 min', 'slots'=>75, 'total'=>100, 'icon'=>'💻', 'intensity'=>'HIGH', 'category'=>'Strength', 'color'=>'#4FC3F7', 'status'=>'active', 'video_url'=>'https://zoom.us/j/fri123'],

            ['id'=>'C601', 'branch_id'=>'B1', 'name'=>'SAVATE KICKBOXING', 'trainer_id'=>'T5', 'time'=>'10:00', 'day'=>'Sat', 'duration'=>'90 min', 'slots'=>8, 'total'=>20, 'icon'=>'🥊', 'intensity'=>'HIGH', 'category'=>'Boxing', 'color'=>'#FF5C00', 'status'=>'active'],
            ['id'=>'C602', 'branch_id'=>'B2', 'name'=>'WEEKEND WARRIOR', 'trainer_id'=>'T1', 'time'=>'08:00', 'day'=>'Sat', 'duration'=>'60 min', 'slots'=>0, 'total'=>20, 'icon'=>'🔥', 'intensity'=>'HIGH', 'category'=>'HIIT', 'color'=>'#FF3131', 'status'=>'active'],
            ['id'=>'CO60', 'branch_id'=>'ONLINE', 'name'=>'VIRTUAL DANCE', 'trainer_id'=>'T6', 'time'=>'16:00', 'day'=>'Sat', 'duration'=>'60 min', 'slots'=>40, 'total'=>50, 'icon'=>'💻', 'intensity'=>'MED', 'category'=>'Dance', 'color'=>'#4FC3F7', 'status'=>'active', 'video_url'=>'https://zoom.us/j/sat123'],

            ['id'=>'C701', 'branch_id'=>'B4', 'name'=>'RECOVERY FLOW', 'trainer_id'=>'T2', 'time'=>'09:00', 'day'=>'Sun', 'duration'=>'60 min', 'slots'=>15, 'total'=>25, 'icon'=>'🌿', 'intensity'=>'LOW', 'category'=>'Yoga', 'color'=>'#00FF85', 'status'=>'active'],
            ['id'=>'C702', 'branch_id'=>'B1', 'name'=>'KETTLEBELL BLAST', 'trainer_id'=>'T7', 'time'=>'16:00', 'day'=>'Sun', 'duration'=>'45 min', 'slots'=>4, 'total'=>12, 'icon'=>'🏋️', 'intensity'=>'HIGH', 'category'=>'Strength', 'color'=>'#FF5C00', 'status'=>'active'],
            ['id'=>'CO70', 'branch_id'=>'ONLINE', 'name'=>'VIRTUAL MEDITATION', 'trainer_id'=>'T8', 'time'=>'20:00', 'day'=>'Sun', 'duration'=>'30 min', 'slots'=>80, 'total'=>100, 'icon'=>'💻', 'intensity'=>'LOW', 'category'=>'Yoga', 'color'=>'#4FC3F7', 'status'=>'active', 'video_url'=>'https://zoom.us/j/sun123'],

            ['id'=>'C801', 'branch_id'=>'B1', 'name'=>'TODAY BURN', 'trainer_id'=>'T1', 'time'=>'09:00', 'day'=>date('D'), 'duration'=>'60 min', 'slots'=>10, 'total'=>20, 'icon'=>'🔥', 'intensity'=>'HIGH', 'category'=>'HIIT', 'color'=>'#FF3131', 'status'=>'active'],
        ];
        foreach ($classes as $cls) { GymClass::create($cls); }

        // ====================================================================
        // 4. DATA DINAMIS (Bookings, Tickets, Transfers, Progress & NOTIFICATIONS)
        // ====================================================================
        $today = date('D, d M');
        $tomorrow = date('D, d M', strtotime('+1 days'));
        $nextWeek = date('D, d M', strtotime('+7 days'));
        $todayStr = date('d M Y');
        $yesterdayStr = date('d M Y', strtotime('-1 days'));

        Booking::truncate();
        Notification::truncate(); // Pastikan tabel notifikasi kosong dulu

        $members = User::where('role', 'member')->get();
        $classes = GymClass::all();
        $products = Product::all();

        $transactionId = 1000;

        // 1. Buat Notifikasi Broadcast Global
        Notification::create([
            'user_id' => 'all',
            'type'    => 'broadcast',
            'title'   => 'Welcome to RAW Gym! 📢',
            'message' => 'Push your limits today! Check out our new class schedule.',
            'is_read' => false
        ]);

        // 2. Looping: Berikan 1 Kelas, 1 Barang, & Notifikasi ke SETIAP Member
        foreach($members as $member) {

            // --- A. RANDOM BOOKING KELAS ---
            $cls = $classes->random();
            $trainer = User::where('trainer_id', $cls->trainer_id)->first();
            $trainerName = $trainer ? $trainer->name : 'RAW Trainer';
            $randomDate = date('D, d M', strtotime('+' . rand(1, 20) . ' days'));

            if ($member->plan && $member->plan !== 'Per Visit') {
                $planPrice = 350000;
                if ($member->plan == 'Quarterly') $planPrice = 900000;
                if ($member->plan == 'Annual') $planPrice = 3000000;

                // Tanggal terakhir bayar disimulasi acak antara 5-30 hari yang lalu
                $lastPayDate = date('d M Y', strtotime('-' . rand(5, 30) . ' days'));

                Booking::create([
                    'transaction_id' => 'SUB-'.$transactionId++,
                    'user_id'        => $member->id,
                    'product_id'     => null,
                    'branch_id'      => $member->branch_id,
                    'class_name'     => $member->plan . ' Membership', // Label Langganan
                    'trainer'        => 'RAW Auto-Bill',
                    'date'           => $lastPayDate,
                    'time'           => '00:00',
                    'status'         => 'completed',
                    'payment_status' => 'verified',
                    'amount'         => $planPrice,
                    'method'         => 'Credit Card',
                    'type'           => 'purchase',
                    'icon'           => '💳',
                    'category'       => 'Subscription',
                    'description'    => 'Recurrent automated billing for ' . $member->plan . ' subscription.'
                ]);
            }

            Notification::create([
                'user_id' => $member->id,
                'type'    => 'class',
                'title'   => 'Class Booked! 🏋️',
                'message' => "Your spot for {$cls->name} on {$randomDate} is confirmed.",
                'is_read' => false
            ]);

            // --- B. RANDOM PURCHASE PRODUK ---
            $prod = $products->random();
            Booking::create([
                'transaction_id' => 'TRX-'.$transactionId++,
                'user_id'        => $member->id,
                'product_id'     => $prod->id,
                'branch_id'      => 'STORE',
                'class_name'     => $prod->name,
                'trainer'        => 'RAW Store',
                'date'           => date('d M Y', strtotime('-' . rand(1, 5) . ' days')),
                'time'           => '10:00',
                'status'         => 'completed',
                'payment_status' => 'verified',
                'amount'         => $prod->price,
                'method'         => 'Credit Card',
                'type'           => 'purchase',
                'icon'           => $prod->icon,
                'category'       => $prod->category
            ]);

            Notification::create([
                'user_id' => $member->id,
                'type'    => 'purchase',
                'title'   => 'Payment Verified 🛒',
                'message' => "Your purchase of {$prod->name} was successful.",
                'is_read' => false
            ]);
        }

        // ==========================================================
        // --- D. DUMMY DATA KHUSUS COACH HENDRA (T1) ---
        // ==========================================================
        $alex = User::where('name', 'Alex Fitria')->first();
        $rina = User::where('name', 'Rina Dewi')->first();

        // Kita buat format tanggal sesuai dengan DYNAMIC_DAYS di React ("Mon, 17 Mar")
        $todayFullDate = date('D, j M');
        $tomorrowFullDate = date('D, j M', strtotime('+1 day'));

        // 1. PRIVATE SESSION HARI INI (Dari Alex) -> SUDAH ABSEN (Menambah Earning 400rb)
        Booking::create([
            'transaction_id' => 'PRV-HENDRA-1',
            'user_id'        => $alex->id,
            'class_id'       => null,
            'branch_id'      => 'B1',
            'class_name'     => 'Private: Coach Hendra',
            'trainer'        => 'Coach Hendra',
            'date'           => $todayFullDate,
            'time'           => '10:00',
            'status'         => 'upcoming',
            'payment_status' => 'verified',
            'amount'         => 500000,
            'method'         => 'Credit Card',
            'type'           => 'private',
            'icon'           => '💪',
            'category'       => 'Private',
            'description'    => 'Location: RAW Uluwatu',
            'is_attended'    => true // 👈 Earning masuk
        ]);

        // 2. PRIVATE SESSION BESOK (Dari Rina) -> BELUM ABSEN
        Booking::create([
            'transaction_id' => 'PRV-HENDRA-2',
            'user_id'        => $rina->id,
            'class_id'       => null,
            'branch_id'      => 'CUSTOM',
            'class_name'     => 'Private: Coach Hendra',
            'trainer'        => 'Coach Hendra',
            'date'           => $tomorrowFullDate,
            'time'           => '15:00',
            'status'         => 'upcoming',
            'payment_status' => 'verified',
            'amount'         => 500000,
            'method'         => 'GoPay',
            'type'           => 'private',
            'icon'           => '💪',
            'category'       => 'Private',
            'description'    => 'Location: Villa Canggu',
            'is_attended'    => false
        ]);

        // 3. KELAS REGULER "TODAY BURN" HARI INI
        $hendraClass = GymClass::where('id', 'C801')->first();
        if ($hendraClass) {
            // Alex sudah diabsen oleh Coach Hendra (Menambah Earning 150rb)
            Booking::create([
                'transaction_id' => 'BK-HENDRA-REG-1',
                'user_id'        => $alex->id,
                'class_id'       => $hendraClass->id,
                'branch_id'      => $hendraClass->branch_id,
                'class_name'     => $hendraClass->name,
                'trainer'        => 'Coach Hendra',
                'date'           => $todayFullDate,
                'time'           => $hendraClass->time,
                'status'         => 'upcoming',
                'payment_status' => 'verified',
                'amount'         => 150000,
                'method'         => 'GoPay',
                'type'           => 'class',
                'icon'           => $hendraClass->icon,
                'is_attended'    => true // 👈 Earning masuk
            ]);
            // Rina terdaftar tapi belum diabsen
            Booking::create([
                'transaction_id' => 'BK-HENDRA-REG-2',
                'user_id'        => $rina->id,
                'class_id'       => $hendraClass->id,
                'branch_id'      => $hendraClass->branch_id,
                'class_name'     => $hendraClass->name,
                'trainer'        => 'Coach Hendra',
                'date'           => $todayFullDate,
                'time'           => $hendraClass->time,
                'status'         => 'upcoming',
                'payment_status' => 'verified',
                'amount'         => 150000,
                'method'         => 'OVO',
                'type'           => 'class',
                'icon'           => $hendraClass->icon,
                'is_attended'    => false
            ]);
        }

        // 4. SHIFT KERJA TRAINER (Trainer Logs)
        TrainerLog::truncate();
        // Log hari ini (Sedang Aktif, mulai 3 jam lalu)
        TrainerLog::create([
            'trainer_id' => 'T1',
            'type'       => 'START',
            'time'       => now()->subHours(3)
        ]);
        // Log kemarin (History Shift)
        TrainerLog::create([
            'trainer_id' => 'T1',
            'type'       => 'START',
            'time'       => now()->subDays(1)->setTime(8, 0)
        ]);
        TrainerLog::create([
            'trainer_id' => 'T1',
            'type'       => 'END',
            'time'       => now()->subDays(1)->setTime(16, 0)
        ]);

        // 5. CATATAN KLIEN (Client Notes)
        ClientNote::truncate();
        ClientNote::create([
            'trainer_id' => 'T1',
            'user_id'    => $alex->id,
            'note'       => 'Form pukulan semakin membaik. Perlu fokus ke footwork & stamina.',
            'date'       => date('d M Y', strtotime('-1 days'))
        ]);
        ClientNote::create([
            'trainer_id' => 'T1',
            'user_id'    => $rina->id,
            'note'       => 'Sesi private pertama sangat bagus, mobility Rina luar biasa.',
            'date'       => date('d M Y')
        ]);

        // 6. RATING & REVIEW DINAMIS
        Review::truncate();
        Review::create([
            'booking_id' => 'REV-DUMMY-1',
            'user_id'    => $alex->id,
            'trainer_id' => 'T1',
            'rating'     => 5,
            'comment'    => 'Coach Hendra is the best! Kelasnya selalu on fire 🔥',
            'is_auto'    => false
        ]);
        Review::create([
            'booking_id' => 'REV-DUMMY-2',
            'user_id'    => $rina->id,
            'trainer_id' => 'T1',
            'rating'     => 4,
            'comment'    => 'Sangat detail memperbaiki form saya.',
            'is_auto'    => false
        ]);

        SupportTicket::truncate();
        $tickets = [
            // Chat Multi-Arah (Admin -> User -> Admin)
            [
                'id'=>'ST001', 'user_id'=>'U10', 'user_name'=>'Alex Fitria', 'subject'=>'Locker issue at Uluwatu', 'message'=>"My locker #42 was jammed yesterday.", 'status'=>'replied', 'date'=>$yesterdayStr,
                'replies'=>[
                    ['from'=>'admin', 'text'=>'Hi Alex, our staff has fixed it this morning. Sorry for the trouble!', 'time'=>date('c', strtotime('-2 hours'))],
                    ['from'=>'member', 'text'=>'Thank you so much! Will try to use it again tomorrow.', 'time'=>date('c', strtotime('-1 hour'))],
                ]
            ],
            ['id'=>'ST002', 'user_id'=>'U11', 'user_name'=>'Rina Dewi', 'subject'=>'How to access online class?', 'message'=>"I booked a virtual class but don't see the Zoom link.", 'status'=>'open', 'replies'=>[], 'date'=>$todayStr],
        ];
        foreach ($tickets as $t) { SupportTicket::create($t); }

        Transfer::truncate();
        $transfers = [
            ['id'=>'TR001', 'user_id'=>'U12', 'type'=>'member', 'name'=>'Budi Santoso', 'from_branch_id'=>'B1', 'to_branch_id'=>'B3', 'reason'=>'Moved my office closer to Berawa', 'status'=>'pending', 'date'=>$todayStr],
        ];
        foreach ($transfers as $tr) { Transfer::create($tr); }

        FitnessProgress::truncate();
        $progress = [
            ['id'=>'PRG1', 'user_id'=>'U10', 'weight'=>76.5, 'note'=>'Bulking phase start', 'date'=>date('d M Y', strtotime('-14 days'))],
            ['id'=>'PRG2', 'user_id'=>'U10', 'weight'=>77.2, 'note'=>'Gaining muscle', 'date'=>date('d M Y', strtotime('-7 days'))],
            ['id'=>'PRG3', 'user_id'=>'U10', 'weight'=>78.0, 'note'=>'Feeling stronger!', 'date'=>$todayStr],
        ];
        foreach ($progress as $p) { FitnessProgress::create($p); }

        Badge::truncate();
        $badges = [
            ['icon' => '🎯', 'name' => 'First Step', 'desc' => 'Complete your first class booking', 'rule_type' => 'class_count', 'target_value' => 1],
            ['icon' => '⚡', 'name' => 'Momentum', 'desc' => 'Book 5 classes', 'rule_type' => 'class_count', 'target_value' => 5],
            ['icon' => '🔥', 'name' => 'On Fire', 'desc' => 'Book 10 classes', 'rule_type' => 'class_count', 'target_value' => 10],
            ['icon' => '🏆', 'name' => 'Legend', 'desc' => 'Complete 20 classes', 'rule_type' => 'class_count', 'target_value' => 20],
            ['icon' => '📅', 'name' => 'Week Warrior', 'desc' => 'Maintain a 7-day streak', 'rule_type' => 'streak', 'target_value' => 7],
            ['icon' => '💪', 'name' => 'Iron Discipline', 'desc' => 'Maintain a 14-day streak', 'rule_type' => 'streak', 'target_value' => 14],
            ['icon' => '🌟', 'name' => 'Committed', 'desc' => 'Stay active for 3 months', 'rule_type' => 'months', 'target_value' => 3],
            ['icon' => '🛒', 'name' => 'RAW Shopper', 'desc' => 'Make your first store purchase', 'rule_type' => 'purchase_count', 'target_value' => 1],
            ['icon' => '🌏', 'name' => 'Branch Explorer', 'desc' => 'Try classes at 2 different branches', 'rule_type' => 'branch_count', 'target_value' => 2],
        ];

        foreach ($badges as $badge) {
            Badge::create($badge);
        }
    }
}
