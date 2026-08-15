<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Product;
use App\Models\GymClass;
use App\Models\Plan;
use App\Models\Branch;
use App\Models\Booking;
use App\Models\SupportTicket;
use App\Models\Transfer;
use App\Models\FitnessProgress;
use App\Models\Badge;
use App\Models\Notification;
use App\Models\TrainerLog;
use App\Models\ClientNote;
use App\Models\Review;
use App\Models\Broadcast;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        User::truncate();
        Product::truncate();
        GymClass::truncate();
        Plan::truncate();
        Branch::truncate();
        Booking::truncate();
        SupportTicket::truncate();
        Transfer::truncate();
        FitnessProgress::truncate();
        Badge::truncate();
        Notification::truncate();
        TrainerLog::truncate();
        ClientNote::truncate();
        Review::truncate();
        Broadcast::truncate();
        Schema::enableForeignKeyConstraints();

        // ====================================================================
        // 1. DATA PENGGUNA — Admin + 10 Trainer resmi (TANPA member dummy)
        // ====================================================================
        $users = [
            ['id' => 1,  'name'=>'Super Admin',    'email'=>'admin@learnmmabalimajesty.com', 'role'=>'admin',   'avatar'=>'🛡️', 'branch_id'=>'B1', 'phone'=>'+62 878-3887-2777', 'address'=>'Jalan Tunjung Saring Gang Padma No. 10, Denpasar Barat, Bali', 'status'=>'active'],
            ['id' => 2,  'name'=>'Coach Hendra',   'email'=>'hendra@gym.com',    'role'=>'trainer', 'avatar'=>'🏋️', 'branch_id'=>'B1', 'trainer_id'=>'T1',  'phone'=>'+62 811-1111-2222', 'address'=>'Denpasar',   'status'=>'active'],
            ['id' => 3,  'name'=>'Sari Wijaya',    'email'=>'sari@gym.com',      'role'=>'trainer', 'avatar'=>'🧘', 'branch_id'=>'B1', 'trainer_id'=>'T2',  'phone'=>'+62 812-2222-3333', 'address'=>'Denpasar',   'status'=>'active'],
            ['id' => 4,  'name'=>'Reza Kurnia',    'email'=>'reza@gym.com',      'role'=>'trainer', 'avatar'=>'🥊', 'branch_id'=>'B1', 'trainer_id'=>'T3',  'phone'=>'+62 813-3333-4444', 'address'=>'Badung',     'status'=>'active'],
            ['id' => 5,  'name'=>'Luna Sari',      'email'=>'luna@gym.com',      'role'=>'trainer', 'avatar'=>'⚡', 'branch_id'=>'B1', 'trainer_id'=>'T4',  'phone'=>'+62 814-4444-5555', 'address'=>'Denpasar',   'status'=>'active'],
            ['id' => 6,  'name'=>'Master Beni',    'email'=>'beni@gym.com',      'role'=>'trainer', 'avatar'=>'🥋', 'branch_id'=>'B1', 'trainer_id'=>'T5',  'phone'=>'+62 815-9999-8888', 'address'=>'Gianyar',    'status'=>'active'],
            ['id' => 7,  'name'=>'Dewi Rahayu',    'email'=>'dewi@gym.com',      'role'=>'trainer', 'avatar'=>'💃', 'branch_id'=>'B1', 'trainer_id'=>'T6',  'phone'=>'+62 816-6666-7777', 'address'=>'Denpasar',   'status'=>'active'],
            ['id' => 8,  'name'=>'Andi Setiawan',  'email'=>'andi@gym.com',      'role'=>'trainer', 'avatar'=>'💪', 'branch_id'=>'B1', 'trainer_id'=>'T7',  'phone'=>'+62 817-7777-8888', 'address'=>'Badung',     'status'=>'active'],
            ['id' => 9,  'name'=>'Maya Lestari',   'email'=>'maya@gym.com',      'role'=>'trainer', 'avatar'=>'🌿', 'branch_id'=>'B1', 'trainer_id'=>'T8',  'phone'=>'+62 818-8888-9999', 'address'=>'Denpasar',   'status'=>'active'],
            ['id' => 18, 'name'=>'Master Lee',     'email'=>'lee@gym.com',       'role'=>'trainer', 'avatar'=>'🥋', 'branch_id'=>'B1', 'trainer_id'=>'T9',  'phone'=>'+62 819-7777-8888', 'address'=>'Badung',     'status'=>'active'],
            ['id' => 19, 'name'=>'Coach Made',     'email'=>'made@gym.com',      'role'=>'trainer', 'avatar'=>'🤼', 'branch_id'=>'B1', 'trainer_id'=>'T10', 'phone'=>'+62 820-5555-6666', 'address'=>'Denpasar',   'status'=>'active'],
        ];
        // Password sama untuk semua akun awal (Admin & Trainer) — WAJIB diganti setelah login pertama.
        // Password awal diambil dari .env (SEED_PASSWORD) — jangan di-commit plaintext.
        $pass = Hash::make(env('SEED_PASSWORD', 'ganti-sekarang'));
        foreach ($users as $user) {
            $user['password'] = $pass;
            $user['plan'] = null;
            $user['streak'] = 0;
            $user['join_date'] = null;
            $user['spend'] = 0;
            $user['total_classes'] = 0;
            $user['dob'] = null;
            $user['emergency_contact'] = null;
            User::create($user);
        }

        // ====================================================================
        // 2. CABANG (BRANCH) — MAJESTY BALI, Denpasar Barat (satu-satunya lokasi)
        // ====================================================================
        Branch::create([
            'id' => 'B1',
            'name' => 'MAJESTY BALI',
            'short' => 'MB',
            'address' => 'Jalan Tunjung Saring Gang Padma No. 10, Denpasar Barat, Bali',
            'area' => 'Denpasar Barat',
            'phone' => '+62 878-3887-2777',
            'hours' => 'Senin–Sabtu 06.00–21.00',
            'facilities' => ['Mat area', 'Ring boxing', 'Heavy bags', 'Locker', 'Parkir', 'Kantin sehat'],
            'rating' => 5.0,
            'reviews' => 0,
            'members' => 0,
            'cover' => '🏟️',
            'color' => '#FFD700',
            'tags' => ['Kombat', 'Fitness', 'Kickboxing', 'MMA', 'Wrestling'],
            'status' => 'active',
        ]);

        // ====================================================================
        // 3. PAKET KEANGGOTAAN — Per Kedatangan & Bulanan (tanpa ikatan tahunan)
        // ====================================================================
        $plans = [
            ['id'=>'visit',   'name'=>'Per Kedatangan', 'price'=>75000,  'period'=>'/kali',  'badge'=>'',           'icon'=>'🎯', 'color'=>'#00E5FF'],
            ['id'=>'monthly', 'name'=>'Bulanan',        'price'=>350000, 'period'=>'/bulan', 'badge'=>'TANPA IKATAN','icon'=>'📅', 'color'=>'#CCFF00'],
        ];
        foreach ($plans as $pl) { Plan::create($pl); }

        // ====================================================================
        // 4. KELAS RESMI — 8 DISIPLIN (sesuai brand MAJESTY BALI)
        // ====================================================================
        $classes = [
            ['id'=>'G101', 'branch_id'=>'B1', 'name'=>'HIIT',             'trainer_id'=>'T1',  'time'=>'06:00', 'day'=>'Mon', 'duration'=>'45 min', 'slots'=>10, 'total'=>20, 'icon'=>'🔥', 'intensity'=>'HIGH', 'category'=>'HIIT',             'color'=>'#FF3131', 'status'=>'active'],
            ['id'=>'G102', 'branch_id'=>'B1', 'name'=>'Kickboxing',       'trainer_id'=>'T3',  'time'=>'07:00', 'day'=>'Mon', 'duration'=>'60 min', 'slots'=>10, 'total'=>20, 'icon'=>'🦵', 'intensity'=>'HIGH', 'category'=>'Kickboxing',       'color'=>'#FF5C00', 'status'=>'active'],
            ['id'=>'G103', 'branch_id'=>'B1', 'name'=>'Taekwondo',        'trainer_id'=>'T9',  'time'=>'16:00', 'day'=>'Tue', 'duration'=>'60 min', 'slots'=>12, 'total'=>25, 'icon'=>'🥋', 'intensity'=>'MED',  'category'=>'Taekwondo',        'color'=>'#4FC3F7', 'status'=>'active'],
            ['id'=>'G104', 'branch_id'=>'B1', 'name'=>'Flexibility',      'trainer_id'=>'T2',  'time'=>'07:30', 'day'=>'Tue', 'duration'=>'60 min', 'slots'=>15, 'total'=>25, 'icon'=>'🧘', 'intensity'=>'LOW',  'category'=>'Flexibility',      'color'=>'#B39DDB', 'status'=>'active'],
            ['id'=>'G105', 'branch_id'=>'B1', 'name'=>'Mind & Body Healing','trainer_id'=>'T8', 'time'=>'18:00', 'day'=>'Wed', 'duration'=>'60 min', 'slots'=>12, 'total'=>20, 'icon'=>'🌿', 'intensity'=>'LOW',  'category'=>'Mind & Body Healing','color'=>'#00FF85', 'status'=>'active'],
            ['id'=>'G106', 'branch_id'=>'B1', 'name'=>'Boxing',           'trainer_id'=>'T3',  'time'=>'07:00', 'day'=>'Thu', 'duration'=>'60 min', 'slots'=>10, 'total'=>20, 'icon'=>'🥊', 'intensity'=>'HIGH', 'category'=>'Boxing',           'color'=>'#FF3131', 'status'=>'active'],
            ['id'=>'G107', 'branch_id'=>'B1', 'name'=>'MMA',              'trainer_id'=>'T3',  'time'=>'19:00', 'day'=>'Fri', 'duration'=>'90 min', 'slots'=>8,  'total'=>16, 'icon'=>'⚔️', 'intensity'=>'HIGH', 'category'=>'MMA',              'color'=>'#FFD700', 'status'=>'active'],
            ['id'=>'G108', 'branch_id'=>'B1', 'name'=>'Wrestling',        'trainer_id'=>'T10', 'time'=>'10:00', 'day'=>'Sat', 'duration'=>'60 min', 'slots'=>12, 'total'=>20, 'icon'=>'🤼', 'intensity'=>'MED',  'category'=>'Wrestling',        'color'=>'#FFA500', 'status'=>'active'],
        ];
        foreach ($classes as $cls) { GymClass::create($cls); }

        // ====================================================================
        // 5. PRODUK TOKO (katalog awal — harga masih contoh, sesuaikan dengan harga resmi)
        // ====================================================================
        $products = [
            ['id' => 'P1',  'name' => 'Oversized MAJESTY Tee', 'price' => 250000, 'cost' => 120000, 'stock' => 55,  'icon' => '👕', 'category' => 'Merchandise', 'description' => 'Kaos premium cotton.'],
            ['id' => 'P2',  'name' => 'MAJESTY Gym Bag',       'price' => 450000, 'cost' => 220000, 'stock' => 30,  'icon' => '🎒', 'category' => 'Merchandise', 'description' => 'Tas gym awet.'],
            ['id' => 'P3',  'name' => 'MAJESTY Cap',           'price' => 150000, 'cost' => 60000,  'stock' => 60,  'icon' => '🧢', 'category' => 'Merchandise', 'description' => 'Topi snapback.'],
            ['id' => 'P4',  'name' => 'MAJESTY Hoodie Pro',    'price' => 550000, 'cost' => 300000, 'stock' => 20,  'icon' => '🧥', 'category' => 'Merchandise', 'description' => 'Hoodie hangat.'],
            ['id' => 'P5',  'name' => 'Gym Towel Microfiber',  'price' => 90000,  'cost' => 40000,  'stock' => 100, 'icon' => '🧻', 'category' => 'Merchandise', 'description' => 'Handuk cepat kering.'],
            ['id' => 'P6',  'name' => 'MAJESTY Whey Isolate',  'price' => 850000, 'cost' => 600000, 'stock' => 85,  'icon' => '🥤', 'category' => 'Supplements',  'description' => '25g protein per sajian.'],
            ['id' => 'P7',  'name' => 'Pre-Workout Monster',   'price' => 450000, 'cost' => 310000, 'stock' => 40,  'icon' => '⚡', 'category' => 'Supplements',  'description' => 'Pre-workout high-stim.'],
            ['id' => 'P8',  'name' => 'BCAA Recovery',         'price' => 320000, 'cost' => 200000, 'stock' => 50,  'icon' => '💊', 'category' => 'Supplements',  'description' => 'Asam amino esensial.'],
            ['id' => 'P9',  'name' => 'Creatine Monohydrate',  'price' => 250000, 'cost' => 150000, 'stock' => 60,  'icon' => '💪', 'category' => 'Supplements',  'description' => 'Creatine murni 5g/sajian.'],
            ['id' => 'P10', 'name' => 'Mass Gainer Elite',     'price' => 950000, 'cost' => 700000, 'stock' => 15,  'icon' => '🏋️', 'category' => 'Supplements',  'description' => '1000 kkal per sajian.'],
            ['id' => 'P11', 'name' => 'MAJESTY Lifting Belt',  'price' => 650000, 'cost' => 400000, 'stock' => 25,  'icon' => '🏋️', 'category' => 'Equipment',    'description' => 'Sabuk angkat besi kulit.'],
            ['id' => 'P12', 'name' => 'Resistance Bands Set',  'price' => 280000, 'cost' => 130000, 'stock' => 40,  'icon' => '🔴', 'category' => 'Equipment',    'description' => 'Set 5 band.'],
            ['id' => 'P13', 'name' => 'Speed Jump Rope',       'price' => 180000, 'cost' => 80000,  'stock' => 50,  'icon' => '🪢', 'category' => 'Equipment',    'description' => 'Gagang ball-bearing.'],
            ['id' => 'P14', 'name' => 'Boxing Gloves 14oz',    'price' => 750000, 'cost' => 450000, 'stock' => 10,  'icon' => '🥊', 'category' => 'Equipment',    'description' => 'Sarung tinju sparring premium.'],
            ['id' => 'P15', 'name' => 'Yoga Mat Pro',          'price' => 350000, 'cost' => 150000, 'stock' => 35,  'icon' => '🧘', 'category' => 'Equipment',    'description' => 'Mat anti-slip 5mm.'],
            ['id' => 'P16', 'name' => 'Protein Smoothie',      'price' => 55000,  'cost' => 20000,  'stock' => 999, 'icon' => '🥛', 'category' => 'F&B',          'description' => 'Smoothie segar.'],
            ['id' => 'P17', 'name' => 'Açaí Bowl',             'price' => 65000,  'cost' => 28000,  'stock' => 999, 'icon' => '🍇', 'category' => 'F&B',          'description' => 'Dengan granola & madu.'],
            ['id' => 'P18', 'name' => 'Cold Brew Coffee',      'price' => 40000,  'cost' => 12000,  'stock' => 999, 'icon' => '☕', 'category' => 'F&B',          'description' => 'Cold brew 18 jam.'],
            ['id' => 'P19', 'name' => 'Mineral Water 1L',      'price' => 15000,  'cost' => 5000,   'stock' => 999, 'icon' => '💧', 'category' => 'F&B',          'description' => 'Tetap terhidrasi.'],
            ['id' => 'P20', 'name' => 'Protein Bar',           'price' => 35000,  'cost' => 15000,  'stock' => 120, 'icon' => '🍫', 'category' => 'F&B',          'description' => 'Snack 20g protein.'],
            ['id' => 'E1',  'name' => 'MAJESTY Throwdown 2026','price' => 350000, 'cost' => 50000,  'stock' => 100, 'icon' => '🏆', 'category' => 'Events',        'description' => 'Kompetisi fitness terbuka semua level.'],
            ['id' => 'E2',  'name' => 'Nutrition Workshop',    'price' => 200000, 'cost' => 30000,  'stock' => 50,  'icon' => '🥗', 'category' => 'Events',        'description' => 'Belajar makro & diet.'],
            ['id' => 'E3',  'name' => 'Yoga Retreat Pass',     'price' => 1500000,'cost' => 800000, 'stock' => 20,  'icon' => '🌅', 'category' => 'Events',        'description' => 'Weekend retreat di Ubud.'],
            ['id' => 'E4',  'name' => 'Boxing Seminar',        'price' => 250000, 'cost' => 50000,  'stock' => 40,  'icon' => '🥊', 'category' => 'Events',        'description' => 'Klinik teknik bersama pro.'],
            ['id' => 'E5',  'name' => 'Beach Bootcamp',        'price' => 100000, 'cost' => 20000,  'stock' => 80,  'icon' => '🏖️', 'category' => 'Events',        'description' => 'Sunday morning di Pantai.'],
        ];
        foreach ($products as $product) { Product::create($product); }
    }
}
