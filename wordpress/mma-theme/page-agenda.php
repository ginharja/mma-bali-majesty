<?php
/*
Template Name: Halaman Agenda
*/
get_header(); 

// Ambil waktu hari ini di server lokal (WITA)
$today = current_time('Y-m-d');

// Helper Fungsi Format Tanggal Indonesia
function mma_format_tgl_indo($tanggal) {
    $bulan = array(1=>'Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des');
    $pecahkan = explode('-', $tanggal);
    return $pecahkan[2] . ' ' . $bulan[(int)$pecahkan[1]] . ' ' . $pecahkan[0];
}
?>

<style>
    /* ==========================================
       CSS KHUSUS HALAMAN AGENDA (KOMBAT STYLE)
       ========================================== */
    .agenda-main { background: #070707; min-height: 100vh; padding-top: 50px; padding-bottom: 100px; font-family: var(--font-body, 'Inter', sans-serif); }
    
    .agenda-header { text-align: center; margin-bottom: 60px; }
    .agenda-header h1 { font-family: 'Teko', sans-serif; font-size: 5rem; color: #fff; text-transform: uppercase; margin: 0; line-height: 1; letter-spacing: 2px;}
    .agenda-header h1 span { color: #e50914; }
    .agenda-divider { width: 100px; height: 4px; background: #e50914; margin: 20px auto; }
    
    .agenda-container { width: 90%; max-width: 1200px; margin: 0 auto; }
    
    .agenda-section-title { font-family: 'Teko', sans-serif; font-size: 3rem; color: #fff; margin-top: 40px; margin-bottom: 30px; text-transform: uppercase; border-bottom: 2px dashed #333; padding-bottom: 15px; }
    .agenda-section-title span { color: #e50914; }
    .title-past { color: #888; border-bottom-color: #333; margin-top: 80px; }
    .title-past span { color: #aaa; }
    
    .agenda-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
    
    /* Kartu Agenda Utama */
    .agenda-card { 
        background: #111; border: 1px solid #222; border-left: 5px solid #e50914; 
        padding: 30px 25px; border-radius: 6px; position: relative; overflow: hidden; 
        transition: all 0.4s ease; display: flex; flex-direction: column; box-shadow: 0 5px 15px rgba(0,0,0,0.5);
    }
    .agenda-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(229,9,20,0.2); border-color: #444; }
    
    /* Pita Ribbon Status */
    .agenda-ribbon { 
        position: absolute; top: 25px; right: -45px; background: #e50914; color: #fff; 
        font-family: 'Teko', sans-serif; font-size: 1.2rem; padding: 5px 50px; 
        transform: rotate(45deg); font-weight: bold; letter-spacing: 2px; box-shadow: 0 2px 8px rgba(0,0,0,0.6); text-align: center; 
    }
    
    .agenda-date-badge { background: #e50914; color: #fff; display: inline-block; padding: 5px 15px; font-family: 'Teko', sans-serif; font-size: 1.5rem; letter-spacing: 1px; margin-bottom: 15px; border-radius: 3px; }
    
    .agenda-card-title { font-family: 'Teko', sans-serif; font-size: 2.2rem; color: #fff; margin: 0 0 15px 0; line-height: 1.1; }
    .agenda-card-title a { color: #fff; text-decoration: none; transition: 0.3s; }
    .agenda-card:hover .agenda-card-title a { color: #e50914; }
    
    .agenda-meta { font-size: 0.95rem; color: #aaa; margin-bottom: 10px; display: flex; align-items: flex-start; gap: 10px; }
    .agenda-meta .icon { color: #e50914; font-size: 1.2rem; }
    
    .agenda-desc { font-size: 0.95rem; color: #888; margin-top: 15px; padding-top: 15px; border-top: 1px dashed #333; flex-grow: 1; line-height: 1.6; }
    
    /* Tombol Baca Detail */
    .agenda-btn-detail { display: inline-block; margin-top: 20px; font-family: 'Teko', sans-serif; font-size: 1.3rem; color: #e50914; text-decoration: none; letter-spacing: 1px; transition: 0.3s; }
    .agenda-card:hover .agenda-btn-detail { color: #fff; transform: translateX(5px); }
    
    /* VARIASI: HARI INI (GLOWING) */
    .agenda-card.today { border-left-color: #FFD700; border-top: 1px solid rgba(255,215,0,0.2); background: linear-gradient(145deg, #1a1a15, #0a0a0a); }
    .agenda-card.today .agenda-date-badge { background: #FFD700; color: #000; }
    .agenda-card.today .agenda-ribbon { background: #FFD700; color: #000; animation: pulseGlow 2s infinite; }
    .agenda-card.today .agenda-meta .icon { color: #FFD700; }
    .agenda-card.today:hover .agenda-card-title a { color: #FFD700; }
    .agenda-card.today .agenda-btn-detail { color: #FFD700; }
    
    /* VARIASI: SELESAI (MUTED) */
    .agenda-card.past { border-left-color: #333; opacity: 0.6; filter: grayscale(100%); }
    .agenda-card.past:hover { transform: none; opacity: 0.9; filter: grayscale(0%); }
    .agenda-card.past .agenda-date-badge, .agenda-card.past .agenda-ribbon { background: #444; color: #aaa; }
    .agenda-card.past .agenda-meta .icon { color: #555; }
    .agenda-card.past .agenda-btn-detail { color: #888; }
    
    @keyframes pulseGlow {
        0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
    }
    
    @media (max-width: 768px) {
        .agenda-header h1 { font-size: 3.5rem; }
        .agenda-section-title { font-size: 2.2rem; }
        .agenda-card-title { font-size: 1.8rem; }
    }
</style>

<main class="agenda-main">
    <header class="agenda-header">
        <h1>JADWAL <span>ARENA</span></h1>
        <div class="agenda-divider"></div>
        <p style="color: #888; font-family: 'Teko', sans-serif; font-size: 1.3rem; letter-spacing: 2px;">KALENDER KEGIATAN MAJESTY BALI</p>
    </header>

    <div class="agenda-container">
        
        <?php
        // =========================================================
        // QUERY 1: AGENDA MENDATANG & HARI INI
        // =========================================================
        $args_up = array(
            'post_type'      => 'mma_agenda',
            'posts_per_page' => -1,
            'meta_key'       => '_agenda_tanggal',
            'orderby'        => 'meta_value',
            'order'          => 'ASC',
            'meta_query'     => array(
                array(
                    'key'     => '_agenda_tanggal',
                    'value'   => $today,
                    'compare' => '>=',
                    'type'    => 'DATE'
                )
            )
        );
        $query_up = new WP_Query($args_up);

        echo '<h2 class="agenda-section-title">AGENDA <span>MENDATANG</span></h2>';
        
        if ($query_up->have_posts()) :
            echo '<div class="agenda-grid">';
            while ($query_up->have_posts()) : $query_up->the_post(); 
                $post_id = get_the_ID();
                $tgl     = get_post_meta($post_id, '_agenda_tanggal', true);
                $waktu   = get_post_meta($post_id, '_agenda_waktu', true);
                $lokasi  = get_post_meta($post_id, '_agenda_lokasi', true);
                $content = wp_trim_words(get_the_content(), 20, '...');
                
                $is_today = ($tgl == $today);
                $s_class  = $is_today ? 'today' : 'upcoming';
                $s_text   = $is_today ? 'HARI INI' : 'SEGERA';
                $d_disp   = $tgl ? mma_format_tgl_indo($tgl) : '-';
                $link     = get_the_permalink();
                ?>
                
                <div class="agenda-card <?php echo $s_class; ?>">
                    <div class="agenda-ribbon"><?php echo $s_text; ?></div>
                    <div><span class="agenda-date-badge">📅 <?php echo $d_disp; ?></span></div>
                    <h3 class="agenda-card-title"><a href="<?php echo $link; ?>"><?php the_title(); ?></a></h3>
                    
                    <div class="agenda-meta">
                        <span class="icon">🕒</span>
                        <span><?php echo $waktu ? esc_html($waktu) . ' WITA' : 'Waktu TBA'; ?></span>
                    </div>
                    <div class="agenda-meta">
                        <span class="icon">📍</span>
                        <span><?php echo $lokasi ? esc_html($lokasi) : 'Lokasi Menyusul'; ?></span>
                    </div>
                    
                    <?php if ($content) : ?>
                        <div class="agenda-desc"><?php echo esc_html($content); ?></div>
                    <?php endif; ?>
                    
                    <a href="<?php echo $link; ?>" class="agenda-btn-detail">LIHAT DETAIL & PANDUAN →</a>
                </div>
                
            <?php endwhile; echo '</div>';
        else :
            echo '<p style="color:#666; font-size:1.2rem; text-align:center; padding: 40px 0;">Belum ada agenda terdekat yang dijadwalkan.</p>';
        endif;
        wp_reset_postdata();

        // =========================================================
        // QUERY 2: AGENDA SELESAI (MASA LALU)
        // =========================================================
        $args_past = array(
            'post_type'      => 'mma_agenda',
            'posts_per_page' => 6, // Ambil 6 agenda terakhir saja
            'meta_key'       => '_agenda_tanggal',
            'orderby'        => 'meta_value',
            'order'          => 'DESC',
            'meta_query'     => array(
                array(
                    'key'     => '_agenda_tanggal',
                    'value'   => $today,
                    'compare' => '<',
                    'type'    => 'DATE'
                )
            )
        );
        $query_past = new WP_Query($args_past);

        if ($query_past->have_posts()) :
            echo '<h2 class="agenda-section-title title-past">AGENDA <span>SELESAI</span></h2>';
            echo '<div class="agenda-grid">';
            while ($query_past->have_posts()) : $query_past->the_post(); 
                $post_id = get_the_ID();
                $tgl     = get_post_meta($post_id, '_agenda_tanggal', true);
                $waktu   = get_post_meta($post_id, '_agenda_waktu', true);
                $lokasi  = get_post_meta($post_id, '_agenda_lokasi', true);
                $d_disp  = $tgl ? mma_format_tgl_indo($tgl) : '-';
                $link    = get_the_permalink();
                ?>
                
                <div class="agenda-card past">
                    <div class="agenda-ribbon">SELESAI</div>
                    <div><span class="agenda-date-badge">📅 <?php echo $d_disp; ?></span></div>
                    <h3 class="agenda-card-title"><a href="<?php echo $link; ?>"><?php the_title(); ?></a></h3>
                    
                    <div class="agenda-meta">
                        <span class="icon">🕒</span>
                        <span><?php echo $waktu ? esc_html($waktu) . ' WITA' : 'Waktu TBA'; ?></span>
                    </div>
                    <div class="agenda-meta">
                        <span class="icon">📍</span>
                        <span><?php echo $lokasi ? esc_html($lokasi) : '-'; ?></span>
                    </div>
                    
                    <a href="<?php echo $link; ?>" class="agenda-btn-detail">LIHAT ARSIP AGENDA →</a>
                </div>
                
            <?php endwhile; echo '</div>';
        endif;
        wp_reset_postdata();
        ?>

    </div>
</main>

<?php get_footer(); ?>