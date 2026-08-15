<?php
get_header(); 

$post_id = get_the_ID();
$tgl     = get_post_meta($post_id, '_agenda_tanggal', true);
$waktu   = get_post_meta($post_id, '_agenda_waktu', true);
$lokasi  = get_post_meta($post_id, '_agenda_lokasi', true);
$today   = current_time('Y-m-d');

// Logika Penentuan Status & Warna
$is_today = ($tgl == $today);
$is_past  = ($tgl < $today);

$status_color = '#00ff00'; // Hijau untuk Segera
$status_text  = 'SEGERA DATANG';

if ($is_today) {
    $status_color = '#FFD700'; // Emas untuk Hari Ini
    $status_text  = 'BERLANGSUNG HARI INI';
} elseif ($is_past) {
    $status_color = '#888888'; // Abu-abu untuk Selesai
    $status_text  = 'TELAH SELESAI';
}

// Format Tanggal
function mma_format_tgl_single($tanggal) {
    if(!$tanggal) return '-';
    $bulan = array(1=>'Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember');
    $pecahkan = explode('-', $tanggal);
    return $pecahkan[2] . ' ' . $bulan[(int)$pecahkan[1]] . ' ' . $pecahkan[0];
}
$d_disp = mma_format_tgl_single($tgl);
?>

<style>
    .single-agenda-wrap { background: #070707; min-height: 100vh; padding-top: 60px; padding-bottom: 100px; font-family: var(--font-body, 'Inter', sans-serif); color: #fff; }
    .sa-container { max-width: 900px; margin: 0 auto; width: 90%; }
    
    .sa-header { border-bottom: 2px solid <?php echo $status_color; ?>; padding-bottom: 20px; margin-bottom: 30px; }
    .sa-badge { display: inline-block; background: <?php echo $status_color; ?>; color: #000; font-family: 'Teko', sans-serif; font-size: 1.5rem; padding: 5px 20px; font-weight: bold; letter-spacing: 1px; border-radius: 3px; margin-bottom: 15px;}
    .sa-title { font-family: 'Teko', sans-serif; font-size: 4rem; line-height: 1.1; margin: 0; text-transform: uppercase; color: #fff; text-shadow: 2px 2px 10px rgba(0,0,0,0.5); }
    
    /* Kotak Info (Meta Box) */
    .sa-meta-box { background: #111; border: 1px solid #222; border-left: 5px solid <?php echo $status_color; ?>; padding: 30px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 25px; margin-bottom: 40px; border-radius: 5px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .sa-meta-item { display: flex; flex-direction: column; }
    .sa-meta-label { color: #888; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
    .sa-meta-value { color: #fff; font-size: 1.3rem; font-weight: 600; display: flex; align-items: center; gap: 10px;}
    .sa-meta-icon { color: <?php echo $status_color; ?>; font-size: 1.5rem; }
    
    /* Teks Deskripsi */
    .sa-content { font-size: 1.15rem; line-height: 1.8; color: #ddd; }
    .sa-content h1, .sa-content h2, .sa-content h3 { color: #fff; font-family: 'Teko', sans-serif; text-transform: uppercase; margin-top: 40px; margin-bottom: 15px; border-bottom: 1px dashed #333; padding-bottom: 10px; letter-spacing: 1px;}
    .sa-content h1 { font-size: 3rem; } .sa-content h2 { font-size: 2.5rem; } .sa-content h3 { font-size: 2rem; color: #e50914;}
    .sa-content ul, .sa-content ol { margin-bottom: 25px; padding-left: 20px; background: rgba(255,255,255,0.02); padding: 20px 20px 20px 40px; border-radius: 5px; border: 1px solid #222;}
    .sa-content li { margin-bottom: 10px; }
    .sa-content p { margin-bottom: 25px; }
    
    /* Tombol Kembali */
    .sa-back-btn { display: inline-flex; align-items: center; gap: 10px; margin-top: 60px; background: transparent; color: #fff; border: 2px solid #555; padding: 12px 30px; text-decoration: none; font-family: 'Teko', sans-serif; font-size: 1.5rem; letter-spacing: 1px; transition: 0.3s; border-radius: 4px; }
    .sa-back-btn:hover { background: #e50914; border-color: #e50914; box-shadow: 0 5px 20px rgba(229,9,20,0.4); }

    @media (max-width: 768px) {
        .sa-title { font-size: 3rem; }
        .sa-meta-box { padding: 20px; }
    }
</style>

<main class="single-agenda-wrap">
    <div class="sa-container">
        
        <header class="sa-header">
            <div class="sa-badge"><?php echo $status_text; ?></div>
            <h1 class="sa-title"><?php the_title(); ?></h1>
        </header>
        
        <div class="sa-meta-box">
            <div class="sa-meta-item">
                <span class="sa-meta-label">Tanggal Pelaksanaan</span>
                <span class="sa-meta-value"><span class="sa-meta-icon">📅</span> <?php echo $d_disp; ?></span>
            </div>
            <div class="sa-meta-item">
                <span class="sa-meta-label">Waktu</span>
                <span class="sa-meta-value"><span class="sa-meta-icon">🕒</span> <?php echo $waktu ? esc_html($waktu) . ' WITA' : 'TBA'; ?></span>
            </div>
            <div class="sa-meta-item">
                <span class="sa-meta-label">Lokasi / Tempat</span>
                <span class="sa-meta-value"><span class="sa-meta-icon">📍</span> <?php echo $lokasi ? esc_html($lokasi) : 'Menyusul'; ?></span>
            </div>
        </div>
        
        <article class="sa-content">
            <?php 
            while (have_posts()) : the_post();
                the_content(); 
            endwhile; 
            ?>
        </article>
        
        <a href="<?php echo site_url('/agenda'); ?>" class="sa-back-btn">← KEMBALI KE KALENDER AGENDA</a>
        
    </div>
</main>

<?php get_footer(); ?>