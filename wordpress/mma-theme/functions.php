<?php
// ==========================================
// 1. SETUP TEMA DASAR
// ==========================================
function mma_setup_theme() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    
    // Mendaftarkan lokasi menu dinamis
    register_nav_menus(array(
        'primary' => 'Menu Utama Header',
    ));
}
add_action('after_setup_theme', 'mma_setup_theme');

// ==========================================
// 2. LOAD CSS (ANTI-CACHE)
// ==========================================
function mma_load_styles() {
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Inter:wght@400;600&display=swap', false);
    wp_enqueue_style('mma-main-style', get_stylesheet_uri(), array(), time()); 
}
add_action('wp_enqueue_scripts', 'mma_load_styles');

// ==========================================
// 3. MATIKAN EDITOR BAWAAN WORDPRESS (PAGE)
// ==========================================
function mma_remove_default_editor() {
    remove_post_type_support('page', 'editor');
}
add_action('init', 'mma_remove_default_editor');


// ==========================================
// 4. META BOX UNTUK HALAMAN FRONTEND (HERO, BIAYA, SPESIMEN)
// ==========================================
function mma_add_custom_boxes() {
    add_meta_box('mma_page_data', 'PENGATURAN KONTEN HALAMAN (KOMBAT STYLE)', 'mma_render_custom_boxes', 'page', 'normal', 'high');
}
add_action('add_meta_boxes', 'mma_add_custom_boxes');

// Tampilan Form di Halaman Edit Page (Diperbarui dengan PDF Embed)
function mma_render_custom_boxes($post) {
    wp_nonce_field('mma_save_data', 'mma_meta_nonce');

    $bg_url = get_post_meta($post->ID, '_mma_bg_url', true) ?: 'https://images.unsplash.com/photo-1599552375246-1be25c276b05?q=80&w=1920&fit=crop';
    $subtitle = get_post_meta($post->ID, '_mma_subtitle', true) ?: 'MAJESTY BALI OPEN CHAMPIONSHIP';
    $btn_text = get_post_meta($post->ID, '_mma_btn_text', true) ?: 'DAFTAR SEKARANG';
    $content = get_post_meta($post->ID, '_mma_content', true);
    
    // (Taruh di atas baris wp_editor Konten Utama)
    $yt_url = get_post_meta($post->ID, '_mma_youtube_url', true);
    echo '<hr style="margin:20px 0;">';
    echo '<div class="mma-admin-box"><label style="color:#FF0000;">▶️ URL Video YouTube (Opsional)</label><input type="text" name="mma_youtube_url" value="' . esc_attr($yt_url) . '" placeholder="Contoh: https://www.youtube.com/watch?v=..." /></div>';
    
    // Data Biaya, Spesimen & PDF
    $fee_wni = get_post_meta($post->ID, '_mma_fee_wni', true);
    $fee_wna = get_post_meta($post->ID, '_mma_fee_wna', true);
    $img_piagam = get_post_meta($post->ID, '_mma_img_piagam', true);
    $img_medali = get_post_meta($post->ID, '_mma_img_medali', true);
    $pdf_proposal = get_post_meta($post->ID, '_mma_pdf_proposal', true);
    $pdf_thb = get_post_meta($post->ID, '_mma_pdf_thb', true);
    $pdf_form = get_post_meta($post->ID, '_mma_pdf_formulir', true);
    
    // Data Khusus Coaching Clinic (BARU)
    $cc_tanggal = get_post_meta($post->ID, '_mma_cc_tanggal', true);
    $cc_tempat = get_post_meta($post->ID, '_mma_cc_tempat', true);
    $cc_biaya = get_post_meta($post->ID, '_mma_cc_biaya', true);
    $cc_pemateri = get_post_meta($post->ID, '_mma_cc_pemateri', true);
    $cc_syarat = get_post_meta($post->ID, '_mma_cc_syarat', true);
    $cc_sertifikat = get_post_meta($post->ID, '_mma_cc_sertifikat', true);

    echo '<style>.mma-admin-box { margin-bottom: 15px; } .mma-admin-box label { font-weight:bold; color:#d32f2f; display:block; margin-bottom:5px; } .mma-admin-box input { width:100%; padding:8px; border:1px solid #ccc; }</style>';

    // --- BAGIAN 1: HERO & KONTEN UMUM ---
    echo '<div class="mma-admin-box"><label>1. URL Gambar Latar (Background Banner)</label><input type="text" name="mma_bg_url" value="' . esc_attr($bg_url) . '" /></div>';
    echo '<div class="mma-admin-box"><label>2. Sub-Judul (Teks Merah di Atas Judul Utama)</label><input type="text" name="mma_subtitle" value="' . esc_attr($subtitle) . '" /></div>';
    echo '<div class="mma-admin-box"><label>3. Teks Tombol (Khusus Beranda)</label><input type="text" name="mma_btn_text" value="' . esc_attr($btn_text) . '" /></div>';

    // --- BAGIAN 2: KHUSUS KEJUARAAN ---
    echo '<hr style="margin:20px 0;">';
    echo '<h4 style="font-size:16px; margin-bottom:10px;">KHUSUS HALAMAN KEJUARAAN (BIAYA, SPESIMEN & DOKUMEN PDF)</h4>';
    
    echo '<div style="display:flex; gap:15px; flex-wrap:wrap;">';
    echo '<div class="mma-admin-box" style="flex:1; min-width:300px;"><label>Biaya Pendaftaran Atlet WNI</label><input type="text" name="mma_fee_wni" value="' . esc_attr($fee_wni) . '" placeholder="Contoh: 250000" /></div>';
    echo '<div class="mma-admin-box" style="flex:1; min-width:300px;"><label>Biaya Pendaftaran Atlet WNA</label><input type="text" name="mma_fee_wna" value="' . esc_attr($fee_wna) . '" placeholder="Contoh: 50" /></div>';
    echo '</div>';

    echo '<div style="display:flex; gap:15px; flex-wrap:wrap;">';
    echo '<div class="mma-admin-box" style="flex:1; min-width:300px;"><label>URL Gambar Spesimen Piagam</label><input type="text" name="mma_img_piagam" value="' . esc_attr($img_piagam) . '" placeholder="https://..." /></div>';
    echo '<div class="mma-admin-box" style="flex:1; min-width:300px;"><label>URL Gambar Spesimen Medali</label><input type="text" name="mma_img_medali" value="' . esc_attr($img_medali) . '" placeholder="https://..." /></div>';
    echo '</div>';
    
    // Form Input PDF
    echo '<div style="display:flex; gap:15px; flex-wrap:wrap;">';
    echo '<div class="mma-admin-box" style="flex:1; min-width:250px;"><label>URL Proposal Kejuaraan (.pdf)</label><input type="text" name="mma_pdf_proposal" value="' . esc_attr($pdf_proposal) . '" placeholder="https://..." /></div>';
    echo '<div class="mma-admin-box" style="flex:1; min-width:300px;"><label>URL Dokumen THB (.pdf)</label><input type="text" name="mma_pdf_thb" value="' . esc_attr($pdf_thb) . '" placeholder="https://..." /></div>';
    echo '<div class="mma-admin-box" style="flex:1; min-width:300px;"><label>URL Formulir Pendaftaran (.pdf)</label><input type="text" name="mma_pdf_formulir" value="' . esc_attr($pdf_form) . '" placeholder="https://..." /></div>';
    echo '</div>';
    
    // --- BAGIAN 3: KHUSUS COACHING CLINIC (BARU) ---
    echo '<hr style="margin:20px 0; border-top: 2px dashed #2196F3;">';
    echo '<h4 style="font-size:16px; margin-bottom:10px; color:#2196F3;">KHUSUS HALAMAN COACHING CLINIC</h4>';
    echo '<div style="display:flex; gap:15px; flex-wrap:wrap;">';
    echo '<div class="mma-admin-box" style="flex:1; min-width:250px;"><label style="color:#2196F3;">Tanggal Pelaksanaan</label><input type="text" name="mma_cc_tanggal" value="' . esc_attr($cc_tanggal) . '" placeholder="Contoh: 15-16 Mei 2026" /></div>';
    echo '<div class="mma-admin-box" style="flex:1; min-width:250px;"><label style="color:#2196F3;">Tempat / Lokasi</label><input type="text" name="mma_cc_tempat" value="' . esc_attr($cc_tempat) . '" placeholder="Contoh: Majesty Training Camp, Bali" /></div>';
    echo '</div>';
    echo '<div style="display:flex; gap:15px; flex-wrap:wrap;">';
    echo '<div class="mma-admin-box" style="flex:1; min-width:250px;"><label style="color:#2196F3;">Biaya Pendaftaran</label><input type="text" name="mma_cc_biaya" value="' . esc_attr($cc_biaya) . '" placeholder="Contoh: Rp 500.000" /></div>';
    echo '<div class="mma-admin-box" style="flex:1; min-width:250px;"><label style="color:#2196F3;">Nama Pemateri / Instruktur Utama</label><input type="text" name="mma_cc_pemateri" value="' . esc_attr($cc_pemateri) . '" placeholder="Contoh: Master Ginanjar Budhiraharja" /></div>';
    echo '</div>';
    echo '<div class="mma-admin-box"><label style="color:#2196F3;">Syarat Peserta</label><textarea name="mma_cc_syarat" rows="3" placeholder="Contoh: Peserta wajib membawa sarung tinju, pelindung kaki, dan bersabuk minimal biru...">' . esc_textarea($cc_syarat) . '</textarea></div>';
    echo '<div class="mma-admin-box"><label style="color:#2196F3;">URL Gambar Spesimen Sertifikat</label><input type="text" name="mma_cc_sertifikat" value="' . esc_attr($cc_sertifikat) . '" placeholder="https://..." /></div>';
    
    echo '<hr style="margin:20px 0;">';

    echo '<div class="mma-admin-box"><label>4. Isi Konten / Teks Utama Halaman</label>';
    wp_editor($content, 'mma_content', array('textarea_name' => 'mma_content', 'media_buttons' => true, 'textarea_rows' => 15));
    echo '</div>';
}

function mma_save_custom_boxes($post_id) {
    if (!isset($_POST['mma_meta_nonce']) || !wp_verify_nonce($_POST['mma_meta_nonce'], 'mma_save_data')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_page', $post_id)) return;

    // Simpan Hero & Umum
    if (isset($_POST['mma_bg_url'])) update_post_meta($post_id, '_mma_bg_url', sanitize_text_field($_POST['mma_bg_url']));
    if (isset($_POST['mma_subtitle'])) update_post_meta($post_id, '_mma_subtitle', sanitize_text_field($_POST['mma_subtitle']));
    if (isset($_POST['mma_btn_text'])) update_post_meta($post_id, '_mma_btn_text', sanitize_text_field($_POST['mma_btn_text']));
    if (isset($_POST['mma_content'])) update_post_meta($post_id, '_mma_content', wp_kses_post($_POST['mma_content']));
    if (isset($_POST['mma_youtube_url'])) update_post_meta($post_id, '_mma_youtube_url', sanitize_url($_POST['mma_youtube_url']));
    
    // Simpan Data Baru & PDF Kejuaraan
    if (isset($_POST['mma_fee_wni'])) update_post_meta($post_id, '_mma_fee_wni', sanitize_text_field($_POST['mma_fee_wni']));
    if (isset($_POST['mma_fee_wna'])) update_post_meta($post_id, '_mma_fee_wna', sanitize_text_field($_POST['mma_fee_wna']));
    if (isset($_POST['mma_img_piagam'])) update_post_meta($post_id, '_mma_img_piagam', sanitize_text_field($_POST['mma_img_piagam']));
    if (isset($_POST['mma_img_medali'])) update_post_meta($post_id, '_mma_img_medali', sanitize_text_field($_POST['mma_img_medali']));
    if (isset($_POST['mma_pdf_proposal'])) update_post_meta($post_id, '_mma_pdf_proposal', sanitize_url($_POST['mma_pdf_proposal']));
    if (isset($_POST['mma_pdf_thb'])) update_post_meta($post_id, '_mma_pdf_thb', sanitize_url($_POST['mma_pdf_thb']));
    if (isset($_POST['mma_pdf_formulir'])) update_post_meta($post_id, '_mma_pdf_formulir', sanitize_url($_POST['mma_pdf_formulir']));
    
    // Simpan Coaching Clinic (BARU)
    if (isset($_POST['mma_cc_tanggal'])) update_post_meta($post_id, '_mma_cc_tanggal', sanitize_text_field($_POST['mma_cc_tanggal']));
    if (isset($_POST['mma_cc_tempat'])) update_post_meta($post_id, '_mma_cc_tempat', sanitize_text_field($_POST['mma_cc_tempat']));
    if (isset($_POST['mma_cc_biaya'])) update_post_meta($post_id, '_mma_cc_biaya', sanitize_text_field($_POST['mma_cc_biaya']));
    if (isset($_POST['mma_cc_pemateri'])) update_post_meta($post_id, '_mma_cc_pemateri', sanitize_text_field($_POST['mma_cc_pemateri']));
    if (isset($_POST['mma_cc_syarat'])) update_post_meta($post_id, '_mma_cc_syarat', sanitize_textarea_field($_POST['mma_cc_syarat']));
    if (isset($_POST['mma_cc_sertifikat'])) update_post_meta($post_id, '_mma_cc_sertifikat', sanitize_url($_POST['mma_cc_sertifikat']));
}
add_action('save_post', 'mma_save_custom_boxes');

// ==========================================
// 5. SISTEM PENDAFTARAN ATLET (LENGKAP DENGAN KATEGORI & BERAT)
// ==========================================

// A. Buat Custom Post Type (Daftar Atlet)
function mma_register_cpt_atlet() {
    register_post_type('mma_atlet', array(
        'labels' => array(
            'name'          => 'Data Pendaftar',
            'singular_name' => 'Atlet',
            'menu_name'     => 'Daftar Atlet',
            'add_new_item'  => 'Tambah Atlet Baru',
            'edit_item'     => 'Edit Data Atlet'
        ),
        'public'      => false,
        'show_ui'     => true,
        'menu_icon'   => 'dashicons-groups',
        'supports'    => array('title'),
        'menu_position' => 5
    ));
}
add_action('init', 'mma_register_cpt_atlet');

// B. Ubah Label "Title" menjadi "Nama Lengkap Atlet"
function mma_change_title_text($title){
    $screen = get_current_screen();
    if  ( 'mma_atlet' == $screen->post_type ) {
        $title = 'NAMA LENGKAP ATLET';
    }
    return $title;
}
add_filter('enter_title_here', 'mma_change_title_text');

// C. Form Input Admin untuk Detail Atlet
function mma_atlet_meta_boxes() {
    add_meta_box('mma_atlet_data', 'DATA LENGKAP ATLET', 'mma_render_atlet_meta', 'mma_atlet', 'normal', 'high');
}
add_action('add_meta_boxes', 'mma_atlet_meta_boxes');

function mma_render_atlet_meta($post) {
    wp_nonce_field('save_atlet_data', 'atlet_meta_nonce');
    $asal_tim = get_post_meta($post->ID, '_asal_tim', true);
    $no_wa    = get_post_meta($post->ID, '_no_wa', true);
    $tgl_lahir= get_post_meta($post->ID, '_tanggal_lahir', true);
    $jk       = get_post_meta($post->ID, '_jenis_kelamin', true);
    $berat    = get_post_meta($post->ID, '_berat_badan', true);
    $kategori = get_post_meta($post->ID, '_kategori_tanding', true);
    $status_aktif = get_post_meta($post->ID, '_status_aktif', true);
    if (empty($status_aktif)) $status_aktif = 'yes'; 
    $pay_status = get_post_meta($post->ID, '_pay_status', true) ?: 'unpaid';

    // CSS diperbarui dengan flex-wrap agar responsif meski masuk sidebar
    echo '<style>.mma-admin-box { margin-bottom: 15px; min-width: 250px;} .mma-admin-box label { font-weight: bold; display: block; margin-bottom: 5px; } .mma-admin-box input, .mma-admin-box select { width: 100%; padding: 8px; box-sizing: border-box;}</style>';
    
    echo '<div style="display:flex; flex-wrap:wrap; gap:20px; background:#f9f9f9; padding:15px; border:1px solid #ccc; margin-bottom:20px;">';
    echo '<div class="mma-admin-box" style="flex:1;"><label style="color:#e50914;">💰 STATUS PEMBAYARAN</label><select name="pay_status" style="font-weight:bold; border:2px solid #e50914;">';
    echo '<option value="unpaid" '.selected($pay_status, 'unpaid', false).'>❌ BELUM BAYAR (PENDING)</option>';
    echo '<option value="paid" '.selected($pay_status, 'paid', false).'>✅ LUNAS</option>';
    echo '</select></div>';
    
    echo '<div style="display:flex; flex-wrap:wrap; gap:20px;">';
    echo '<div class="mma-admin-box" style="flex:1;"><label>ASAL SASANA / TIM</label><input type="text" name="asal_tim" value="' . esc_attr($asal_tim) . '" /></div>';
    echo '<div class="mma-admin-box" style="flex:1;"><label>WHATSAPP OFISIAL</label><input type="text" name="no_wa" value="' . esc_attr($no_wa) . '" /></div>';
    echo '<div class="mma-admin-box" style="flex:1; border-left: 3px solid #e50914; padding-left:15px;"><label style="color:#e50914;">STATUS ATLET</label><select name="status_aktif" style="border: 1px solid #e50914; font-weight:bold;">';
    echo '<option value="yes" '.selected($status_aktif, 'yes', false).'>✅ ACTIVE (Ikut Tanding)</option>';
    echo '<option value="no" '.selected($status_aktif, 'no', false).'>❌ INACTIVE (Batal Tanding)</option>';
    echo '</select></div>';
    echo '</div>';

    echo '<div style="display:flex; flex-wrap:wrap; gap:20px;">';
    echo '<div class="mma-admin-box" style="flex:1;"><label>TANGGAL LAHIR</label><input type="date" name="tanggal_lahir" value="' . esc_attr($tgl_lahir) . '" /></div>';
    echo '<div class="mma-admin-box" style="flex:1;"><label>JENIS KELAMIN</label><select name="jenis_kelamin">';
    echo '<option value="">-- Pilih --</option>';
    echo '<option value="Laki-laki" '.selected($jk, 'Laki-laki', false).'>Laki-laki</option>';
    echo '<option value="Perempuan" '.selected($jk, 'Perempuan', false).'>Perempuan</option>';
    echo '</select></div>';
    echo '</div>';

    echo '<div style="display:flex; flex-wrap:wrap; gap:20px;">';
    echo '<div class="mma-admin-box" style="flex:1;"><label>BERAT BADAN (KG)</label><input type="number" step="0.1" name="berat_badan" value="' . esc_attr($berat) . '" /></div>';
    echo '<div class="mma-admin-box" style="flex:1;"><label>KATEGORI TANDING</label><select name="kategori_tanding">';
    echo '<option value="">-- Pilih --</option>';
    echo '<option value="Assaut" '.selected($kategori, 'Assaut', false).'>Assaut</option>';
    echo '<option value="Combat" '.selected($kategori, 'Combat', false).'>Combat</option>';
    echo '</select></div>';
    echo '</div>';
}

function mma_save_atlet_meta($post_id) {
    if (!isset($_POST['atlet_meta_nonce']) || !wp_verify_nonce($_POST['atlet_meta_nonce'], 'save_atlet_data')) return;
    if (isset($_POST['pay_status'])) update_post_meta($post_id, '_pay_status', sanitize_text_field($_POST['pay_status']));
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (isset($_POST['asal_tim'])) update_post_meta($post_id, '_asal_tim', sanitize_text_field($_POST['asal_tim']));
    if (isset($_POST['no_wa'])) update_post_meta($post_id, '_no_wa', sanitize_text_field($_POST['no_wa']));
    if (isset($_POST['tanggal_lahir'])) update_post_meta($post_id, '_tanggal_lahir', sanitize_text_field($_POST['tanggal_lahir']));
    if (isset($_POST['jenis_kelamin'])) update_post_meta($post_id, '_jenis_kelamin', sanitize_text_field($_POST['jenis_kelamin']));
    if (isset($_POST['berat_badan'])) update_post_meta($post_id, '_berat_badan', sanitize_text_field($_POST['berat_badan']));
    if (isset($_POST['kategori_tanding'])) update_post_meta($post_id, '_kategori_tanding', sanitize_text_field($_POST['kategori_tanding']));
    if (isset($_POST['status_aktif'])) update_post_meta($post_id, '_status_aktif', sanitize_text_field($_POST['status_aktif']));
}
add_action('save_post_mma_atlet', 'mma_save_atlet_meta');

// D. Tampilkan Kolom Data di Tabel Daftar Atlet
function mma_atlet_columns($columns) {
    $new_columns = array(
        'cb'       => $columns['cb'],
        'title'    => 'NAMA ATLET',
        'asal_tim' => 'ASAL SASANA',
        'kategori' => 'KATEGORI',
        'berat'    => 'BERAT (KG)',
        'jk'       => 'L/P',
        'no_wa'    => 'WHATSAPP',
        'date'     => 'TANGGAL'
    );
    return $new_columns;
}
add_filter('manage_mma_atlet_posts_columns', 'mma_atlet_columns');

function mma_atlet_columns_data($column, $post_id) {
    switch ($column) {
        case 'asal_tim': echo esc_html(get_post_meta($post_id, '_asal_tim', true)); break;
        case 'kategori': echo '<strong>' . esc_html(get_post_meta($post_id, '_kategori_tanding', true)) . '</strong>'; break;
        case 'berat': echo esc_html(get_post_meta($post_id, '_berat_badan', true)); break;
        case 'jk': 
            $kelamin = get_post_meta($post_id, '_jenis_kelamin', true); 
            echo ($kelamin == 'Laki-laki') ? 'L' : (($kelamin == 'Perempuan') ? 'P' : '-'); 
            break;
        case 'no_wa':
            $wa = esc_html(get_post_meta($post_id, '_no_wa', true));
            echo '<a href="https://wa.me/'.preg_replace('/[^0-9]/', '', $wa).'" target="_blank">'.$wa.'</a>';
            break;
    }
}
add_action('manage_mma_atlet_posts_custom_column', 'mma_atlet_columns_data', 10, 2);

// ==========================================
// 5. E. MESIN PENANGKAP DATA FRONTEND (ANTI-SPAM, ANTI-INJEKSI, ANTI-GANDA & WA REDIRECT)
// ==========================================
function mma_terima_pendaftaran() {
    // 1. Tangkap URL halaman tempat form ini berada (Halaman Keanggotaan)
    $redirect_url = isset($_POST['_wp_http_referer']) ? esc_url_raw($_POST['_wp_http_referer']) : home_url();

    // 2. Cek Keamanan Nonce
    if ( ! isset( $_POST['atlet_nonce_field'] ) || ! wp_verify_nonce( $_POST['atlet_nonce_field'], 'submit_atlet_action' ) ) {
        wp_die('Akses ditolak! Token keamanan tidak valid atau halaman tercache. Silakan kembali dan refresh halaman. <br><br><a href="' . esc_url($redirect_url) . '" style="padding:10px 20px; background:#e50914; color:#fff; text-decoration:none;">⬅ KEMBALI</a>');
    }

    // 3. Cek Jebakan Spam (Honeypot)
    if ( ! empty( $_POST['mma_bot_trap'] ) ) {
        wp_die('Aktivitas Spam Terdeteksi! Pendaftaran diblokir. <br><br><a href="' . esc_url($redirect_url) . '">⬅ KEMBALI</a>');
    }

    // 4. Proses Penyimpanan Data
    if (isset($_POST['atlet_name']) && isset($_POST['tanggal_lahir'])) {
        
        // Sanitasi Data
        $atlet_name = sanitize_text_field($_POST['atlet_name']);
        $asal_tim   = sanitize_text_field($_POST['asal_tim']);
        $no_wa      = sanitize_text_field($_POST['no_wa']);
        $tgl_lahir  = sanitize_text_field($_POST['tanggal_lahir']);
        $jk         = sanitize_text_field($_POST['jenis_kelamin']);
        $berat      = sanitize_text_field($_POST['berat_badan']);
        $kategori   = sanitize_text_field($_POST['kategori_tanding']);

        // ----------------------------------------------------
        // CEK 1: VALIDASI UMUR (7 - 35 TAHUN) PER 30 APRIL 2026
        // ----------------------------------------------------
        try {
            $birthDate = new DateTime($tgl_lahir);
            $eventDate = new DateTime('2026-04-30');
            $age = $birthDate->diff($eventDate)->y;

            if ($age < 7 || $age > 35) {
                // Lemparkan notif error "invalid_age"
                $redirect_url = add_query_arg('status', 'invalid_age', remove_query_arg('status', $redirect_url));
                
                if (!headers_sent()) { wp_redirect($redirect_url); exit; } 
                else { echo '<script>window.location.href="'.esc_url_raw($redirect_url).'";</script>'; exit; }
            }
        } catch (Exception $e) {
            wp_die('Format tanggal lahir tidak valid!');
        }
        
        // ----------------------------------------------------
        // CEK 2: LOGIKA ANTI-GANDA (CEK NAMA & TANGGAL LAHIR SAMA)
        // ----------------------------------------------------
        $potensi_ganda = get_posts(array(
            'post_type'      => 'mma_atlet',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'meta_query'     => array(
                array(
                    'key'     => '_tanggal_lahir',
                    'value'   => $tgl_lahir,
                    'compare' => '='
                )
            )
        ));

        $is_duplicate = false;
        foreach ($potensi_ganda as $p) {
            if (strtolower(trim($p->post_title)) == strtolower(trim($atlet_name))) {
                $is_duplicate = true;
                break;
            }
        }

        if ($is_duplicate) {
            // Jika Ganda, kembalikan ke form dengan notif error "exists"
            $redirect_url = add_query_arg('status', 'exists', remove_query_arg('status', $redirect_url));
        } else {
            // Jika Aman, Simpan ke Tabel wp_posts
            $post_id = wp_insert_post(array(
                'post_title'  => $atlet_name,
                'post_type'   => 'mma_atlet',
                'post_status' => 'publish' 
            ));

            // Simpan Meta Data
            if ($post_id && !is_wp_error($post_id)) {
                update_post_meta($post_id, '_asal_tim', $asal_tim);
                update_post_meta($post_id, '_no_wa', $no_wa);
                update_post_meta($post_id, '_tanggal_lahir', $tgl_lahir);
                update_post_meta($post_id, '_jenis_kelamin', $jk);
                update_post_meta($post_id, '_berat_badan', $berat);
                update_post_meta($post_id, '_kategori_tanding', $kategori);
                update_post_meta($post_id, '_status_aktif', 'yes'); // Default Active
                
                // ----------------------------------------------------
                // FORMAT PESAN OTOMATIS KE WHATSAPP ADMIN
                // ----------------------------------------------------
                $admin_wa = '6283898227772';
                $pesan_wa = "Halo Admin MAJESTY BALI, saya ingin mengonfirmasi pendaftaran atlet dengan detail berikut:\n\n";
                $pesan_wa .= "👤 *Nama Atlet:* " . $atlet_name . "\n";
                $pesan_wa .= "🥊 *Asal Sasana/Tim:* " . $asal_tim . "\n";
                $pesan_wa .= "📅 *Tanggal Lahir:* " . $tgl_lahir . "\n";
                $pesan_wa .= "⚧️ *Jenis Kelamin:* " . $jk . "\n";
                $pesan_wa .= "⚖️ *Berat Badan:* " . $berat . " Kg\n";
                $pesan_wa .= "🥋 *Kategori Tanding:* " . $kategori . "\n";
                $pesan_wa .= "📱 *No. WA:* " . $no_wa . "\n\n";
                $pesan_wa .= "Mohon informasi untuk instruksi pembayarannya. Terima kasih!";
                
                // Ubah link redirect menjadi link API WhatsApp
                $redirect_url = "https://api.whatsapp.com/send?phone=" . $admin_wa . "&text=" . urlencode($pesan_wa);
            }
        }
    }

    // 5. SISTEM REDIRECT (Gunakan wp_redirect & esc_url_raw agar tidak merusak link WA)
    if (!headers_sent()) {
        wp_redirect($redirect_url);
        exit;
    } else {
        echo '<script type="text/javascript">';
        echo 'window.location.href="' . esc_url_raw($redirect_url) . '";';
        echo '</script>';
        echo '<noscript>';
        echo '<meta http-equiv="refresh" content="0;url=' . esc_url_raw($redirect_url) . '" />';
        echo '</noscript>';
        exit;
    }
}
add_action('admin_post_nopriv_submit_atlet', 'mma_terima_pendaftaran');
add_action('admin_post_submit_atlet', 'mma_terima_pendaftaran');

// ==========================================
// 6. OPEN GRAPH (SEO & SOCIAL MEDIA SHARE)
// ==========================================
function mma_add_open_graph_tags() {
    if ( is_singular() ) {
        global $post;
        
        $og_url = get_permalink( $post->ID );
        $og_title = get_the_title() . ' | ' . get_bloginfo('name');
        
        if ( is_front_page() ) {
            $subtitle = get_post_meta($post->ID, '_mma_subtitle', true) ?: 'April 2026';
            $og_title = get_bloginfo('name') . ' - ' . $subtitle;
        }
        
        $og_desc = get_bloginfo('description'); 
        $custom_content = get_post_meta($post->ID, '_mma_content', true);
        if ( !empty($custom_content) ) {
            $og_desc = wp_trim_words( wp_strip_all_tags( $custom_content ), 25, '...' );
        }
        
        $og_image = get_post_meta($post->ID, '_mma_bg_url', true);
        if ( empty($og_image) ) {
            $og_image = 'https://images.unsplash.com/photo-1599552375246-1be25c276b05?q=80&w=1200&fit=crop';
        }

        echo "\n\n";
        echo '<meta property="og:locale" content="id_ID" />' . "\n";
        echo '<meta property="og:type" content="website" />' . "\n";
        echo '<meta property="og:title" content="' . esc_attr($og_title) . '" />' . "\n";
        echo '<meta property="og:description" content="' . esc_attr($og_desc) . '" />' . "\n";
        echo '<meta property="og:url" content="' . esc_url($og_url) . '" />' . "\n";
        echo '<meta property="og:site_name" content="' . esc_attr(get_bloginfo('name')) . '" />' . "\n";
        echo '<meta property="og:image" content="' . esc_url($og_image) . '" />' . "\n";
        echo '<meta property="og:image:width" content="1200" />' . "\n";
        echo '<meta property="og:image:height" content="630" />' . "\n";
        echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
        echo "\n\n";
    }
}
add_action('wp_head', 'mma_add_open_graph_tags', 5);

// ==========================================
// 7. SISTEM KEAMANAN (ANTI-HACKER & ANTI-JUDOL)
// ==========================================

// 1. Matikan XML-RPC
add_filter('xmlrpc_enabled', '__return_false');

// 2. Sembunyikan Versi WP
remove_action('wp_head', 'wp_generator');

// 3. Blokir Bot User Enumeration
if (!is_admin()) {
    if (preg_match('/author=([0-9]*)/i', $_SERVER['QUERY_STRING'])) {
        wp_die('Akses Ditolak! Aktivitas mencurigakan direkam.');
    }
    add_filter('redirect_canonical', 'mma_block_user_enum', 10, 2);
}
function mma_block_user_enum($redirect, $request) {
    if (preg_match('/\?author=([0-9]*)(\/*)/i', $request)) {
        wp_die('Akses Ditolak! Aktivitas mencurigakan direkam.');
    }
    return $redirect;
}

// 4. Tambahkan Security Headers
function mma_add_security_headers() {
    header('X-Frame-Options: SAMEORIGIN');
    header('X-XSS-Protection: 1; mode=block');
    header('X-Content-Type-Options: nosniff');
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
}
add_action('send_headers', 'mma_add_security_headers');

// 5. Matikan REST API User Endpoint
add_filter('rest_endpoints', function( $endpoints ) {
    if ( isset( $endpoints['/wp/v2/users'] ) ) {
        unset( $endpoints['/wp/v2/users'] );
    }
    if ( isset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] ) ) {
        unset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] );
    }
    return $endpoints;
});

// ==========================================
// 8. CUSTOMIZER (PENGATURAN LOGO HEADER & FOOTER)
// ==========================================
function mma_customize_register($wp_customize) {
    // Buat Panel Menu Baru di Customizer
    $wp_customize->add_section('mma_logos', array(
        'title'    => 'Pengaturan Logo Partner',
        'priority' => 30,
    ));

    // 1. Logo Header
    $wp_customize->add_setting('mma_header_logo');
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'mma_header_logo', array(
        'label'    => 'Logo Header (MAJESTY BALI)',
        'section'  => 'mma_logos',
        'settings' => 'mma_header_logo',
    )));

    // 2. Logo Footer (Multiple)
    $footer_logos = array(
        'mma_footer_logo_1' => 'Logo Footer 1 (MAJESTY BALI)',
        'mma_footer_logo_2' => 'Logo Footer 2 (mma Bali)',
        'mma_footer_logo_3' => 'Logo Footer 3 (mma Indonesia)',
        'mma_footer_logo_4' => 'Logo Footer 4 (donatur majesty)',
        'mma_footer_logo_5' => 'Logo Footer 5 (KOI / Kemenpora)'
    );

    foreach ($footer_logos as $id => $label) {
        $wp_customize->add_setting($id);
        $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, $id, array(
            'label'    => $label,
            'section'  => 'mma_logos',
            'settings' => $id,
        )));
    }
}
add_action('customize_register', 'mma_customize_register');

// ==========================================
// 9. SISTEM DRAWING MATCH INTERAKTIF & DATABASE SAVE (WP ADMIN)
// ==========================================

// A. Tambahkan Menu Sub-Halaman
// Menu Drawing Match
function mma_add_drawing_menu() {
    // Ubah manage_options menjadi manage_administrasi
    add_submenu_page('edit.php?post_type=mma_atlet', 'Drawing Match', '🏆 Drawing Match', 'manage_administrasi', 'mma-drawing-match', 'mma_render_drawing_page');
}
add_action('admin_menu', 'mma_add_drawing_menu');

// B. FUNGSI LOGIKA BAGAN (GUGUR MURNI - URUT BB TERDEKAT)
function mma_generate_bracket_matches($atlet_list, $usia_kategori) {
    $count = count($atlet_list);
    if ($count == 0) return array();

    // Kuota Kelas (Pra-Remaja max 2, Remaja & Senior max 4)
    $pool_size = ($usia_kategori == 'Pra-Remaja') ? 2 : 4;
    $byes_count = $pool_size - $count;

    $r1_match_count = $pool_size / 2;
    $r1_pairs = array();

    // Siapkan slot kosong
    for ($i = 0; $i < $r1_match_count; $i++) {
        $r1_pairs[$i] = array('biru' => null, 'merah' => null, 'winner' => null);
    }

    // Distribusi urut agar BB terdekat bertemu (Index 0 vs 1, Index 2 vs 3)
    $idx = 0;
    for ($i = 0; $i < $r1_match_count; $i++) {
        if ($idx < $count) $r1_pairs[$i]['biru'] = $atlet_list[$idx++];
        
        if ($idx < $count) {
            $r1_pairs[$i]['merah'] = $atlet_list[$idx++];
        } else {
            $r1_pairs[$i]['merah'] = 'BYE'; 
        }
    }

    $matches = array();
    $matches[1] = $r1_pairs;

    $total_rounds = log($pool_size, 2);
    for ($r = 2; $r <= $total_rounds; $r++) {
        $num_matches = count($matches[$r-1]) / 2;
        for ($i = 0; $i < $num_matches; $i++) {
            $matches[$r][$i] = array(
                'biru' => 'Pemenang Partai R'.($r-1).'-'.($i*2 + 1),
                'merah' => 'Pemenang Partai R'.($r-1).'-'.($i*2 + 2),
                'winner' => null
            );
        }
    }
    $matches['champion'] = null; 
    return $matches;
}

// HELPER: Pemecah Pool Otomatis & Pengurut Berat Badan
function mma_process_grouped_data($raw_grouped_data) {
    $final_grouped_data = array();
    foreach ($raw_grouped_data as $jk => $kat_data) {
        foreach ($kat_data as $kat => $usia_data) {
            foreach ($usia_data as $usia => $kelas_data) {
                foreach ($kelas_data as $kelas => $atlet_list) {
                    
                    // 1. Urutkan atlet berdasarkan berat badan (Terkecil ke Terbesar)
                    usort($atlet_list, function($a, $b) {
                        $beratA = isset($a['berat']) ? floatval($a['berat']) : 0;
                        $beratB = isset($b['berat']) ? floatval($b['berat']) : 0;
                        return $beratA <=> $beratB;
                    });

                    // 2. Batasi maksimal orang per Pool
                    $max_size = ($usia == 'Pra-Remaja') ? 2 : 4;
                    $chunks = array_chunk($atlet_list, $max_size);
                    
                    // 3. Pecah nama kelas (Jika lebih dari 1 pool, jadi Pool A, Pool B, dst)
                    if (count($chunks) == 1) {
                        $final_grouped_data[$jk][$kat][$usia][$kelas] = $chunks[0];
                    } else {
                        $pool_labels = range('A', 'Z');
                        foreach ($chunks as $index => $chunk) {
                            $pool_name = $kelas . ' (Pool ' . $pool_labels[$index] . ')';
                            $final_grouped_data[$jk][$kat][$usia][$pool_name] = $chunk;
                        }
                    }
                }
            }
        }
    }
    return $final_grouped_data;
}

// C. AJAX HANDLER UNTUK MENYIMPAN CENTANG KE DATABASE
add_action('wp_ajax_mma_save_bracket_winner', 'mma_ajax_save_bracket_winner');
function mma_ajax_save_bracket_winner() {
    if (!current_user_can('manage_administrasi')) wp_send_json_error();

    $group_id = sanitize_text_field($_POST['group_id']);
    $round = intval($_POST['round']);
    $match_idx = intval($_POST['match_idx']);
    $corner = sanitize_text_field($_POST['corner']); // 'biru', 'merah', or 'hapus'

    $all_brackets = get_option('mma_all_brackets', array());
    if (!isset($all_brackets[$group_id])) wp_send_json_error();

    $bracket = $all_brackets[$group_id];

    if ($corner == 'hapus') {
        $bracket[$round][$match_idx]['winner'] = null;
        $next_round = $round + 1;
        $next_match_idx = floor($match_idx / 2);
        $next_corner = ($match_idx % 2 == 0) ? 'biru' : 'merah';
        
        if (isset($bracket[$next_round])) {
            $bracket[$next_round][$next_match_idx][$next_corner] = 'Pemenang Partai R'.$round.'-'.($match_idx+1);
        } else {
            $bracket['champion'] = null;
        }
    } else {
        $bracket[$round][$match_idx]['winner'] = $corner;
        $winner_data = $bracket[$round][$match_idx][$corner];
        
        $next_round = $round + 1;
        $next_match_idx = floor($match_idx / 2);
        $next_corner = ($match_idx % 2 == 0) ? 'biru' : 'merah';
        
        if (isset($bracket[$next_round])) {
            $bracket[$next_round][$next_match_idx][$next_corner] = $winner_data;
        } else {
            $bracket['champion'] = $winner_data;
        }
    }

    $all_brackets[$group_id] = $bracket;
    update_option('mma_all_brackets', $all_brackets);
    wp_send_json_success();
}

// ==========================================
// 9. D. RENDER TAMPILAN BAGAN & ENGINE JAVASCRIPT (PRO MAX)
// ==========================================
function mma_render_drawing_page() {
    // RESET DATABASE JIKA TOMBOL SHUFFLE DITEKAN
    if (isset($_GET['shuffle']) && $_GET['shuffle'] == 'true') {
        delete_option('mma_all_brackets');
        echo '<div class="notice notice-success is-dismissible"><p>✅ Database Bagan berhasil direset & diacak ulang!</p></div>';
    }

    $all_brackets = get_option('mma_all_brackets', array());
    $needs_db_update = false;

    $args = array( 'post_type' => 'mma_atlet', 'posts_per_page' => -1, 'post_status' => 'publish' );
    $atlet_posts = get_posts($args);
    $grouped_data = array();

    foreach ($atlet_posts as $post) {
        $id = $post->ID;
        $nama = strtoupper($post->post_title);
        $tim = strtoupper(get_post_meta($id, '_asal_tim', true) ?: 'INDEPENDEN');
        $tgl_lahir = get_post_meta($id, '_tanggal_lahir', true);
        $jk = get_post_meta($id, '_jenis_kelamin', true);
        $berat = floatval(get_post_meta($id, '_berat_badan', true));
        $kat_tanding = get_post_meta($id, '_kategori_tanding', true);
        $status_aktif = get_post_meta($id, '_status_aktif', true);

        if (empty($tgl_lahir) || empty($berat) || empty($jk) || empty($kat_tanding)|| $status_aktif == 'no') continue; 

        $birthDate = new DateTime($tgl_lahir);
        $eventDate = new DateTime('2026-04-30'); 
        $age = $birthDate->diff($eventDate)->y;

        $kategori_usia = ''; $kelas_berat = '';

        if ($age >= 7 && $age < 13) {
            $kategori_usia = 'Pra-Remaja';
            if ($berat <= 25) $kelas_berat = 'Under 25 kg'; elseif ($berat <= 28) $kelas_berat = 'Under 28 kg'; elseif ($berat <= 31) $kelas_berat = 'Under 31 kg'; elseif ($berat <= 34) $kelas_berat = 'Under 34 kg'; elseif ($berat <= 37) $kelas_berat = 'Under 37 kg'; elseif ($berat <= 40) $kelas_berat = 'Under 40 kg'; else $kelas_berat = 'Over 40 kg';
        } elseif ($age >= 13 && $age < 17) {
            $kategori_usia = 'Remaja';
            if ($berat <= 43) $kelas_berat = 'Under 43 kg'; elseif ($berat <= 46) $kelas_berat = 'Under 46 kg'; elseif ($berat <= 49) $kelas_berat = 'Under 49 kg'; elseif ($berat <= 52) $kelas_berat = 'Under 52 kg'; elseif ($berat <= 55) $kelas_berat = 'Under 55 kg'; elseif ($berat <= 58) $kelas_berat = 'Under 58 kg'; else $kelas_berat = 'Over 58 kg';
        } elseif ($age >= 17) {
            $kategori_usia = 'Senior';
            if ($berat <= 49) $kelas_berat = 'Under 49 kg'; elseif ($berat <= 52) $kelas_berat = 'Under 52 kg'; elseif ($berat <= 55) $kelas_berat = 'Under 55 kg'; elseif ($berat <= 58) $kelas_berat = 'Under 58 kg'; elseif ($berat <= 61) $kelas_berat = 'Under 61 kg'; elseif ($berat <= 64) $kelas_berat = 'Under 64 kg'; elseif ($berat <= 67) $kelas_berat = 'Under 67 kg'; elseif ($berat <= 70) $kelas_berat = 'Under 70 kg'; elseif ($berat <= 73) $kelas_berat = 'Under 73 kg'; else $kelas_berat = 'Over 73 kg';
        } else { continue; }
        
        $grouped_data[$jk][$kat_tanding][$kategori_usia][$kelas_berat][] = array('nama' => $nama, 'tim' => $tim, 'berat'=> $berat, 'umur' => $age);
    }

    // Fungsi Pemecah Pool (Dari Revisi Sebelumnya)
    $grouped_data = mma_process_grouped_data($grouped_data);

    static $match_counter = 1;

    // Load HTML2PDF Library
    echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>';

    echo '<div class="wrap mma-drawing-wrap">';
    
    // HEADER & CONTROL PANEL (SEARCH)
    echo '<div class="drawing-header-panel">';
    echo '<h1 class="main-title" style="margin-bottom:10px;">🏆 VISUAL DRAWING & BAGAN PERTANDINGAN</h1>';
    echo '<div class="drawing-controls">';
    echo '<input type="text" id="searchBagan" placeholder="🔍 Cari Nama Atlet atau Sasana..." class="drawing-search-input">';
    echo '<a href="?post_type=mma_atlet&page=mma-drawing-match&shuffle=true" class="button button-primary shuffle-btn" onclick="return confirm(\'PERINGATAN! Ini akan menghapus semua kemajuan bagan pemenang. Anda yakin?\');">🔄 ACAK ULANG BAGAN (RESET)</a>';
    echo '</div>';
    echo '</div>';

    if (empty($grouped_data)) { echo '<div class="notice notice-warning"><p>Belum ada data atlet lengkap.</p></div></div>'; return; }

    // CSS KOMBAT + PAGINATION + CONTROLS
    echo '<style>
        .mma-drawing-wrap { background: #070707; color: #fff; padding: 20px; font-family: Inter, sans-serif; }
        .drawing-header-panel { margin-bottom: 30px; border-bottom: 2px solid #e50914; padding-bottom: 20px;}
        .main-title { font-family: Teko, sans-serif; font-size: 2.8rem; color: #e50914; margin-top:0; border:none;}
        .drawing-controls { display: flex; gap: 15px; align-items: center; flex-wrap: wrap; }
        .drawing-search-input { flex-grow: 1; padding: 10px 15px !important; font-size: 1.2rem !important; background: #111 !important; border: 1px solid #444 !important; color: #fff !important; border-radius: 4px; }
        .drawing-search-input:focus { border-color: #e50914 !important; outline: none !important; box-shadow: 0 0 10px rgba(229,9,20,0.3) !important;}
        .shuffle-btn { background:#e50914 !important; border-color:#cc0000 !important; text-transform:uppercase; font-family:Teko; font-size:1.2rem !important; padding: 5px 20px !important; height: auto !important; }
        .btn-pdf { float: right; background: #FFD700; color: #000; border: none; padding: 5px 15px; font-family: Teko; font-size: 1.1rem; cursor: pointer; border-radius: 3px; font-weight: bold;}
        .btn-pdf:hover { background: #fff; }
        .drawing-pagination { display: flex; justify-content: center; gap: 10px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;}
        .page-btn { background: #222; color: #fff; border: 1px solid #444; padding: 8px 15px; cursor: pointer; border-radius: 3px; font-weight: bold; transition: 0.2s;}
        .page-btn:hover { background: #e50914; border-color: #e50914;}
        .page-btn.active { background: #e50914; border-color: #e50914; pointer-events: none;}
        .page-info { color: #888; font-size: 1.1rem; padding: 8px 0; }
        .gender-block { background: #111; border: 1px solid #222; border-left: 5px solid #e50914; padding: 25px; margin-bottom: 40px; }
        .gender-title { font-family: Teko, sans-serif; font-size: 2.2rem; color: #fff; margin-top: 0; }
        .kelas-wrapper { border: 1px solid #333; background: #0a0a0a; margin-bottom: 30px; padding: 20px; overflow-x: auto;}
        .kelas-header { font-family: Teko, sans-serif; font-size: 1.8rem; color: #fff; margin-bottom: 30px; background: #222; padding: 10px 15px; border-left: 4px solid #FFD700;}
        .bracket { display: flex; flex-direction: row; gap: 80px; align-items: center; min-width: max-content; padding-right: 50px; padding-bottom: 20px;}
        .round { display: flex; flex-direction: column; gap: 30px; justify-content: center; }
        .round-title { font-family: Teko, sans-serif; font-size: 1.4rem; color: #e50914; text-align: center; margin-bottom: 15px; letter-spacing: 1px;}
        .match-pair { position: relative; display: flex; flex-direction: column; gap: 10px; width: 280px; }
        .atlet-card { background: #000; border: 1px solid #333; padding: 15px 15px 15px 20px; position: relative; box-sizing: border-box; height: 80px; transition: 0.3s; }
        .atlet-content { display: flex; justify-content: space-between; align-items: center; height: 100%; gap: 10px; }
        .atlet-meta { flex-grow: 1; overflow: hidden; }
        .atlet-nama { font-family: Teko, sans-serif; font-size: 1.4rem; line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; margin-bottom: 2px;}
        .atlet-info { font-size: 0.75rem; color: #888; text-transform: uppercase; }
        .atlet-berat { background: #e50914; color: #fff; font-family: Teko; padding: 3px 6px; font-size: 1rem; border-radius: 3px; flex-shrink: 0;}
        .winner-cb { appearance: none; width: 22px; height: 22px; border: 2px solid #e50914; background: transparent; cursor: pointer; border-radius: 3px; outline: none; flex-shrink: 0; position: relative; transition: 0.2s; }
        .winner-cb:checked { background: #e50914; }
        .winner-cb:checked::after { content: "✔"; color: #fff; position: absolute; left: 3px; top: -3px; font-size: 14px; }
        .corner-blue { border-left: 6px solid #0066ff !important; }
        .corner-red { border-left: 6px solid #ff0000 !important; }
        .label-sudut { position: absolute; font-family: Teko; font-size: 0.8rem; letter-spacing: 1px; }
        .label-biru { top: -20px; left: 0; color: #0066ff; }
        .label-merah { bottom: -20px; left: 0; color: #ff0000; }
        .ranting-biru { position: absolute; top: 25%; right: -40px; width: 40px; height: 25%; border-top: 2px solid #0066ff; border-right: 2px solid #0066ff; border-top-right-radius: 5px; }
        .ranting-merah { position: absolute; bottom: 25%; right: -40px; width: 40px; height: 25%; border-bottom: 2px solid #ff0000; border-right: 2px solid #ff0000; border-bottom-right-radius: 5px; }
        .ranting-lanjut { position: absolute; top: 50%; right: -80px; width: 25px; border-top: 2px solid #555; }
        .match-number { position: absolute; top: 50%; right: -55px; transform: translateY(-50%); background: #222; border: 1px solid #e50914; color: #fff; font-family: Teko; font-size: 1rem; padding: 2px 8px; z-index: 5; border-radius: 4px; box-shadow: 0 0 10px rgba(229,9,20,0.4);}
        .final-number { right: -30px; background: #e50914; border-color: #fff; }
        .bye-card { border-style: dashed !important; border-color: #444 !important; background: transparent !important; }
        .bye-card .atlet-nama { color: #555 !important; }
        .pending-card { border-style: dashed !important; border-color: #444 !important; background: transparent !important; }
        .pending-card .atlet-nama { color: #555 !important; }
        .active-card .atlet-nama { color: #fff !important; }
        .champion-card { background: rgba(255,215,0,0.1) !important; border-color: #FFD700 !important; box-shadow: 0 0 20px rgba(255,215,0,0.3) !important; }
        .champion-card .atlet-nama { color: #FFD700 !important; font-size: 1.8rem; }
    </style>';

    echo '<div id="bagan-container">';

    // Looping Render HTML
    foreach (array('Laki-laki', 'Perempuan') as $jk) {
        if (!isset($grouped_data[$jk])) continue;
        echo '<div class="gender-block"><h2 class="gender-title">🚻 KELOMPOK: ' . esc_html($jk) . '</h2>';

        foreach (array('Assaut', 'Combat') as $kat_tanding) {
            if (!isset($grouped_data[$jk][$kat_tanding])) continue;
            // Judul Kategori Dihilangkan dan disatukan ke Kelas Header

            foreach (array('Pra-Remaja', 'Remaja', 'Senior') as $usia) {
                if (!isset($grouped_data[$jk][$kat_tanding][$usia])) continue;
                
                $kelas_data = $grouped_data[$jk][$kat_tanding][$usia];
                ksort($kelas_data); 

                foreach ($kelas_data as $kelas => $atlet_list) {
                    $group_id = md5($jk.$kat_tanding.$usia.$kelas); 
                    
                    if (!isset($all_brackets[$group_id])) {
                        $rounds_data = mma_generate_bracket_matches($atlet_list, $usia);
                        $all_brackets[$group_id] = $rounds_data;
                        $needs_db_update = true;
                    } else {
                        $rounds_data = $all_brackets[$group_id];
                    }

                    // CLASS WRAPPER (Target Search & Pagination)
                    echo '<div class="kelas-wrapper" data-search="'.strtolower(esc_attr(json_encode($atlet_list))).'">';
                    
                    // HEADER KELAS & TOMBOL PDF (Diperbarui dengan nama kategori)
                    $nama_kelas = 'USIA: '.esc_html($usia).' | KELAS: ' . esc_html($kelas);
                    echo '<div class="kelas-header">';
                    echo $nama_kelas . ' <span style="color:#888; font-size:1.2rem;">('.count($atlet_list).' Atlet)</span> <strong style="color:#FFD700; margin-left: 10px;">' . strtoupper($kat_tanding) . '</strong>';
                    echo '<button class="btn-pdf" onclick="cetakPDF(\'export-'.$group_id.'\', \''.esc_attr($nama_kelas).'_'.esc_attr($kat_tanding).'\')">📄 DOWNLOAD PDF</button>';
                    echo '</div>';

                    // AREA EXPORT PDF
                    echo '<div id="export-'.$group_id.'" style="background:#070707; padding:20px; border:1px solid #222;">';
                    echo '<h2 style="display:none; color:#e50914; font-family:sans-serif; text-align:center; margin-bottom:30px;" class="pdf-only-title">BAGAN '.$nama_kelas.' - '.strtoupper($jk).' ('.strtoupper($kat_tanding).')</h2>';

                    $total_rounds = count($rounds_data) - 1; 

                    echo '<div class="bracket">';
                    for ($r = 1; $r <= $total_rounds; $r++) {
                        $is_final = ($r == $total_rounds);
                        echo '<div class="round">';
                        echo '<div class="round-title">' . ($is_final ? 'FINAL / PEREBUTAN EMAS' : 'RONDE '.$r) . '</div>';

                        foreach ($rounds_data[$r] as $idx => $match) {
                            $winner = isset($match['winner']) ? $match['winner'] : null;

                            echo '<div class="match-pair">';

                            // --- ATAS: SUDUT BIRU ---
                            $biru = $match['biru'];
                            $is_bye_biru = ($biru === 'BYE');
                            $is_pending_biru = (is_string($biru) && strpos($biru, 'Pemenang Partai') !== false);
                            $is_checked_biru = ($winner === 'biru') ? 'checked' : '';
                            
                            echo '<div class="atlet-card corner-blue ' . ($is_bye_biru ? 'bye-card' : ($is_pending_biru ? 'pending-card' : 'active-card')) . '" id="node-'.$group_id.'-r'.$r.'-m'.$idx.'-biru">';
                            echo '<div class="label-sudut label-biru">SUDUT BIRU</div>';
                            echo '<div class="atlet-content">';
                            
                            $n_str = is_array($biru) ? $biru['nama'] : $biru;
                            $i_str = is_array($biru) ? $biru['tim'].' | Umur: '.$biru['umur'].'th' : '';
                            $b_str = is_array($biru) ? $biru['berat'].'kg' : '';
                            $is_active = is_array($biru);

                            echo '<div class="atlet-meta" style="'.($is_active ? 'text-align:left; width:auto;' : 'text-align:center; width:100%;').'">';
                            echo '<strong class="atlet-nama">'.esc_html($n_str).'</strong>';
                            echo '<div class="atlet-info" style="display:'.($is_active ? 'block' : 'none').';">'.esc_html($i_str).'</div>';
                            echo '</div>';

                            if (!$is_bye_biru) {
                                echo '<input type="checkbox" class="winner-cb" id="cb-'.$group_id.'-r'.$r.'-m'.$idx.'-biru" onchange="advanceAthlete(this, \''.$group_id.'\', '.$r.', '.$total_rounds.', '.$idx.', \'biru\')" style="display:'.($is_active ? 'block' : 'none').';" '.$is_checked_biru.'>';
                            }

                            echo '<div class="atlet-berat" style="display:'.($is_active ? 'block' : 'none').';">'.esc_html($b_str).'</div>';
                            echo '</div></div>';

                            // --- RANTING SAMBUNGAN ---
                            echo '<div class="ranting-biru"></div><div class="ranting-merah"></div>';
                            echo '<div class="match-number">No. ' . $match_counter++ . '</div><div class="ranting-lanjut"></div>';

                            // --- BAWAH: SUDUT MERAH ---
                            $merah = $match['merah'];
                            $is_bye_merah = ($merah === 'BYE');
                            $is_pending_merah = (is_string($merah) && strpos($merah, 'Pemenang Partai') !== false);
                            $is_checked_merah = ($winner === 'merah') ? 'checked' : '';

                            echo '<div class="atlet-card corner-red ' . ($is_bye_merah ? 'bye-card' : ($is_pending_merah ? 'pending-card' : 'active-card')) . '" id="node-'.$group_id.'-r'.$r.'-m'.$idx.'-merah">';
                            echo '<div class="atlet-content">';
                            
                            $n_str2 = is_array($merah) ? $merah['nama'] : $merah;
                            $i_str2 = is_array($merah) ? $merah['tim'].' | Umur: '.$merah['umur'].'th' : '';
                            $b_str2 = is_array($merah) ? $merah['berat'].'kg' : '';
                            $is_active2 = is_array($merah);

                            echo '<div class="atlet-meta" style="'.($is_active2 ? 'text-align:left; width:auto;' : 'text-align:center; width:100%;').'">';
                            echo '<strong class="atlet-nama">'.esc_html($n_str2).'</strong>';
                            echo '<div class="atlet-info" style="display:'.($is_active2 ? 'block' : 'none').';">'.esc_html($i_str2).'</div>';
                            echo '</div>';

                            if (!$is_bye_merah) {
                                echo '<input type="checkbox" class="winner-cb" id="cb-'.$group_id.'-r'.$r.'-m'.$idx.'-merah" onchange="advanceAthlete(this, \''.$group_id.'\', '.$r.', '.$total_rounds.', '.$idx.', \'merah\')" style="display:'.($is_active2 ? 'block' : 'none').';" '.$is_checked_merah.'>';
                            }

                            echo '<div class="atlet-berat" style="display:'.($is_active2 ? 'block' : 'none').';">'.esc_html($b_str2).'</div>';
                            echo '</div>';
                            echo '<div class="label-sudut label-merah">SUDUT MERAH</div>';
                            echo '</div>';

                            echo '</div>'; // End Match Pair
                        }
                        echo '</div>'; // End Round
                    }

                    // --- KOTAK SANG JUARA ---
                    $champ = isset($rounds_data['champion']) ? $rounds_data['champion'] : null;
                    $is_champ_active = is_array($champ);

                    echo '<div class="round">';
                    echo '<div class="round-title" style="color:#FFD700; font-size:1.8rem; text-shadow: 0 0 10px rgba(255,215,0,0.5);">🏆 SANG JUARA</div>';
                    echo '<div class="match-pair" style="justify-content:center;">';
                    echo '<div class="atlet-card '.($is_champ_active ? 'champion-card' : 'pending-card').'" id="node-'.$group_id.'-champion" style="border-width:2px; min-height: 90px; margin-top:20px;">';
                    echo '<div class="atlet-content" style="'.($is_champ_active ? '' : 'justify-content:center; text-align:center;').'">';
                    
                    $c_n_str = $is_champ_active ? $champ['nama'] : 'Menunggu Hasil...';
                    $c_i_str = $is_champ_active ? $champ['tim'].' | Umur: '.$champ['umur'].'th' : '';
                    $c_b_str = $is_champ_active ? $champ['berat'].'kg' : '';

                    echo '<div class="atlet-meta" style="width: '.($is_champ_active ? 'auto' : '100%').';">';
                    echo '<strong class="atlet-nama" style="color:'.($is_champ_active ? '#FFD700' : '#555').'; font-size:1.6rem; text-transform:uppercase;">'.esc_html($c_n_str).'</strong>';
                    echo '<div class="atlet-info" style="display:'.($is_champ_active ? 'block' : 'none').'; color:#FFD700; font-size:0.9rem;">'.esc_html($c_i_str).'</div>';
                    echo '</div>';
                    echo '<div class="atlet-berat" style="display:'.($is_champ_active ? 'block' : 'none').'; background:#FFD700; color:#000; font-size:1.2rem;">'.esc_html($c_b_str).'</div>';
                    
                    echo '</div></div></div></div>'; 
                    echo '</div>'; // End Bracket
                    echo '</div>'; // End Export Area
                    echo '</div>'; // End Kelas Wrapper
                }
            }
        }
        echo '</div>'; // End Gender Block
    }
    
    echo '</div>'; // End Bagan Container
    
    // AREA PAGINATION CONTROLS
    echo '<div class="drawing-pagination" id="pagination-controls"></div>';
    echo '</div>'; // End Wrap

    if ($needs_db_update) update_option('mma_all_brackets', $all_brackets);

    // ========================================================
    // ENGINE JAVASCRIPT: ADVANCE ATHLETE, SEARCH, PAGINATION & PDF
    // ========================================================
    echo "<script>
    function advanceAthlete(cb, groupId, round, totalRounds, matchIdx, corner) {
        let otherCorner = (corner === 'biru') ? 'merah' : 'biru';
        let otherCb = document.getElementById('cb-' + groupId + '-r' + round + '-m' + matchIdx + '-' + otherCorner);
        if (otherCb && cb.checked) otherCb.checked = false;

        jQuery.post(ajaxurl, {
            action: 'mma_save_bracket_winner', group_id: groupId, round: round, match_idx: matchIdx, corner: cb.checked ? corner : 'hapus'
        });

        let isFinal = (round === totalRounds);
        let targetId = isFinal ? 'node-' + groupId + '-champion' : 'node-' + groupId + '-r' + (round + 1) + '-m' + Math.floor(matchIdx / 2) + '-' + (matchIdx % 2 === 0 ? 'biru' : 'merah');
        let targetCard = document.getElementById(targetId);

        if (!targetCard) return; 

        let targetNama = targetCard.querySelector('.atlet-nama');
        let targetInfo = targetCard.querySelector('.atlet-info');
        let targetBerat = targetCard.querySelector('.atlet-berat');
        let targetMeta = targetCard.querySelector('.atlet-meta');
        let targetCb = targetCard.querySelector('.winner-cb'); 

        if (cb.checked) {
            let sourceCard = cb.closest('.atlet-card');
            targetNama.innerText = sourceCard.querySelector('.atlet-nama').innerText;
            targetInfo.innerText = sourceCard.querySelector('.atlet-info').innerText;
            targetBerat.innerText = sourceCard.querySelector('.atlet-berat').innerText;
            
            targetInfo.style.display = 'block'; targetBerat.style.display = 'block';
            if (targetCb) targetCb.style.display = 'block'; 
            
            targetMeta.style.textAlign = isFinal ? 'center' : 'left';
            targetMeta.style.width = isFinal ? '100%' : 'auto';
            if(isFinal) { targetNama.style.color = '#FFD700'; targetInfo.style.color = '#FFD700'; targetBerat.style.background = '#FFD700'; targetBerat.style.color = '#000'; }
            
            targetCard.classList.remove('pending-card');
            targetCard.classList.add(isFinal ? 'champion-card' : 'active-card');
        } else {
            targetNama.innerText = isFinal ? 'Menunggu Hasil...' : 'Pemenang Partai R' + round + '-' + (matchIdx + 1);
            targetInfo.style.display = 'none'; targetBerat.style.display = 'none';
            if (targetCb) { targetCb.style.display = 'none'; targetCb.checked = false; }
            
            targetMeta.style.textAlign = 'center'; targetMeta.style.width = '100%';
            if(isFinal) { targetNama.style.color = '#555'; }
            
            targetCard.classList.remove(isFinal ? 'champion-card' : 'active-card');
            targetCard.classList.add('pending-card');
            if (targetCb) { let event = new Event('change'); targetCb.dispatchEvent(event); }
        }
    }

    function cetakPDF(elementId, title) {
        var element = document.getElementById(elementId);
        var hiddenTitle = element.querySelector('.pdf-only-title');
        if(hiddenTitle) hiddenTitle.style.display = 'block';

        var opt = {
          margin:       0.2,
          filename:     'Bagan_' + title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, backgroundColor: '#070707' },
          jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
        };
        
        html2pdf().set(opt).from(element).save().then(function() {
            if(hiddenTitle) hiddenTitle.style.display = 'none';
        });
    }

    jQuery(document).ready(function($) {
        var currentPage = 1;
        var itemsPerPage = 3; 
        var allWrappers = $('.kelas-wrapper');
        var filteredWrappers = allWrappers.toArray();

        function renderPagination() {
            var totalPages = Math.ceil(filteredWrappers.length / itemsPerPage);
            if (totalPages === 0) totalPages = 1;
            if (currentPage > totalPages) currentPage = totalPages;

            allWrappers.hide();
            $('.gender-block').hide();

            var start = (currentPage - 1) * itemsPerPage;
            var end = start + itemsPerPage;
            var pageItems = filteredWrappers.slice(start, end);

            $(pageItems).show();
            $(pageItems).closest('.gender-block').show();

            var controls = '';
            if(totalPages > 1) {
                controls += '<button class=\"page-btn\" id=\"btn-prev\" '+(currentPage === 1 ? 'disabled style=\"opacity:0.5;\"' : '')+'>&laquo; SEBELUMNYA</button>';
                controls += '<span class=\"page-info\"> Halaman '+currentPage+' dari '+totalPages+' </span>';
                controls += '<button class=\"page-btn\" id=\"btn-next\" '+(currentPage === totalPages ? 'disabled style=\"opacity:0.5;\"' : '')+'>SELANJUTNYA &raquo;</button>';
            }
            $('#pagination-controls').html(controls);
        }

        renderPagination();

        $(document).on('click', '#btn-next', function() { currentPage++; renderPagination(); window.scrollTo(0, 0); });
        $(document).on('click', '#btn-prev', function() { currentPage--; renderPagination(); window.scrollTo(0, 0); });

        $('#searchBagan').on('input', function() {
            var keyword = $(this).val().toLowerCase();
            if(keyword === '') {
                filteredWrappers = allWrappers.toArray();
            } else {
                filteredWrappers = allWrappers.filter(function() {
                    var htmlText = $(this).text().toLowerCase();
                    var dataSearch = $(this).attr('data-search') || '';
                    return htmlText.includes(keyword) || dataSearch.includes(keyword);
                }).toArray();
            }
            currentPage = 1; 
            renderPagination();
        });
    });
    </script>";
}
// ==========================================
// 10. SISTEM IMPORT DATA ATLET (EXCEL/CSV) PRO MAX
// ==========================================

// A. Buat Menu Sub-Halaman "Import Excel"
// Menu Import Excel
function mma_add_import_menu() {
    // Ubah manage_options menjadi manage_administrasi
    add_submenu_page('edit.php?post_type=mma_atlet', 'Import Data Excel', '📥 Import Excel', 'manage_administrasi', 'mma-import-excel', 'mma_render_import_page');
}
add_action('admin_menu', 'mma_add_import_menu');

// B. Tampilan Halaman Import & Mesin Pembaca (SheetJS)
function mma_render_import_page() {
    ?>
    <div class="wrap" style="background: #070707; color: #fff; padding: 20px; font-family: Inter, sans-serif;">
        <h1 style="font-family: Teko, sans-serif; font-size: 2.8rem; color: #e50914; border-bottom: 2px solid #e50914; padding-bottom: 10px; margin-bottom: 20px;">📥 IMPORT DATA ATLET (EXCEL/CSV)</h1>
        
        <div style="background: #111; border: 1px solid #333; border-left: 5px solid #e50914; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #fff; margin-top: 0; font-size: 1.5rem;">Format Kolom Excel yang Wajib Digunakan:</h3>
            <p style="color: #aaa;">Pastikan baris pertama (Header) di file Anda sama persis hurufnya seperti urutan berikut:</p>
            <ol style="color: #00ff00; font-family: monospace; font-size: 1.1rem; background: #000; padding: 15px 35px; border-radius: 5px; border: 1px solid #222;">
                <li>NAMA</li>
                <li>SASANA</li>
                <li>KATEGORI</li>
                <li>BERAT</li>
                <li>KELAMIN</li>
                <li>TGL_LAHIR</li>
                <li>WHATSAPP</li>
            </ol>
        </div>

        <div style="background: #0a0a0a; border: 1px dashed #555; padding: 40px; text-align: center;">
            <input type="file" id="excel_file" accept=".xlsx, .xls, .csv" style="margin-bottom: 20px; font-size: 1.2rem; color: #fff;">
            <br>
            <button id="btn_process" class="button button-primary" style="background: #e50914; border-color: #cc0000; font-size: 1.2rem; padding: 5px 30px; height: auto;">Mulai Import Data</button>
            <div id="import_status" style="margin-top: 20px; font-size: 1.2rem; font-weight: bold;"></div>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script>
    jQuery(document).ready(function($) {
        $('#btn_process').on('click', function() {
            var file = document.getElementById('excel_file').files[0];
            if (!file) {
                alert('Pilih file Excel/CSV terlebih dahulu!');
                return;
            }

            $('#import_status').html('<span style="color: #ffcc00;">Membaca file... Mohon tunggu.</span>');

            var reader = new FileReader();
            reader.onload = function(e) {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, {type: 'array'}); 
                var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                
                // PERBAIKAN FATAL: raw: true memaksa SheetJS memberikan string asli dari CSV tanpa mengubah formatnya!
                var excelData = XLSX.utils.sheet_to_json(firstSheet, { raw: true, defval: "" });
                
                if(excelData.length === 0) {
                    $('#import_status').html('<span style="color: red;">File kosong atau format salah!</span>');
                    return;
                }

                $('#import_status').html('<span style="color: #00ccff;">File terbaca! Menyimpan ' + excelData.length + ' data ke database...</span>');

                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'mma_process_import',
                        atlet_data: excelData
                    },
                    success: function(response) {
                        if(response.success) {
                            $('#import_status').html('<span style="color: #00ff00;">✅ BERHASIL! ' + response.data + '</span>');
                            $('#excel_file').val(''); 
                        } else {
                            $('#import_status').html('<span style="color: red;">❌ GAGAL: ' + response.data + '</span>');
                        }
                    },
                    error: function() {
                        $('#import_status').html('<span style="color: red;">❌ Terjadi kesalahan koneksi server.</span>');
                    }
                });
            };
            reader.readAsArrayBuffer(file);
        });
    });
    </script>
    <?php
}

// C. Handler AJAX PHP untuk Menyimpan & MENG-UPDATE Data ke Database
add_action('wp_ajax_mma_process_import', 'mma_ajax_process_import');
function mma_ajax_process_import() {
    if (!current_user_can('manage_administrasi')) wp_send_json_error('Akses ditolak.');

    $atlet_data = isset($_POST['atlet_data']) ? $_POST['atlet_data'] : '';
    if (empty($atlet_data) || !is_array($atlet_data)) wp_send_json_error('Data kosong.');

    $count_new = 0;
    $count_update = 0;

    foreach ($atlet_data as $raw_row) {
        
        // Pembersih Header (Menghapus enter tersembunyi \r\n)
        $row = array();
        foreach ($raw_row as $key => $value) {
            $clean_key = trim(strtoupper($key));
            $row[$clean_key] = $value;
        }

        if (empty($row['NAMA'])) continue;
        $nama_atlet = sanitize_text_field($row['NAMA']);

        // ==========================================
        // FITUR BARU: CEK APAKAH ATLET SUDAH ADA (UPSERT LOGIC)
        // ==========================================
        $existing_post = get_page_by_title($nama_atlet, OBJECT, 'mma_atlet');
        
        if ($existing_post) {
            // Jika sudah ada, ambil ID-nya untuk di-update
            $post_id = $existing_post->ID;
            $count_update++;
        } else {
            // Jika belum ada, buat post baru
            $post_data = array(
                'post_title'   => $nama_atlet,
                'post_type'    => 'mma_atlet',
                'post_status'  => 'publish',
            );
            $post_id = wp_insert_post($post_data);
            if (is_wp_error($post_id)) continue;
            $count_new++;
        }

        // Mulai Proses Eksekusi Meta Data
        $sasana = isset($row['SASANA']) ? sanitize_text_field($row['SASANA']) : 'Independen';
        $kategori = isset($row['KATEGORI']) ? sanitize_text_field($row['KATEGORI']) : 'Combat';
        $berat = isset($row['BERAT']) ? sanitize_text_field($row['BERAT']) : '0';
        $kelamin = isset($row['KELAMIN']) ? sanitize_text_field($row['KELAMIN']) : 'Laki-laki';
        
        // Pengaman Tanggal Lahir (Mencegah format berubah)
        $tgl_lahir_raw = isset($row['TGL_LAHIR']) ? sanitize_text_field($row['TGL_LAHIR']) : '2000-01-01';
        if (is_numeric($tgl_lahir_raw)) {
            $unix_date = ($tgl_lahir_raw - 25569) * 86400;
            $tgl_lahir = gmdate("Y-m-d", $unix_date);
        } elseif (preg_match('/^\d{4}-\d{2}-\d{2}$/', $tgl_lahir_raw)) {
            $tgl_lahir = $tgl_lahir_raw;
        } else {
            $time_parsed = strtotime(str_replace('/', '-', $tgl_lahir_raw));
            $tgl_lahir = $time_parsed ? date('Y-m-d', $time_parsed) : '2000-01-01';
        }

        // Pengaman Nomor WhatsApp (Mengembalikan angka 0 di depan)
        $wa = isset($row['WHATSAPP']) ? sanitize_text_field($row['WHATSAPP']) : '';
        $wa = preg_replace('/[^0-9]/', '', $wa); 
        if (strpos($wa, '8') === 0) {
            $wa = '0' . $wa;
        } elseif (strpos($wa, '62') === 0) {
            $wa = '0' . substr($wa, 2);
        }

        // Standarisasi Kelamin
        if (strtolower($kelamin) == 'l' || strtolower($kelamin) == 'laki') $kelamin = 'Laki-laki';
        if (strtolower($kelamin) == 'p' || strtolower($kelamin) == 'perempuan' || strtolower($kelamin) == 'wanita') $kelamin = 'Perempuan';

        // TIMPA (UPDATE) SELURUH DATA LAMA DENGAN YANG BARU
        update_post_meta($post_id, '_asal_tim', $sasana);
        update_post_meta($post_id, '_kategori_tanding', ucfirst(strtolower($kategori)));
        update_post_meta($post_id, '_berat_badan', preg_replace('/[^0-9.]/', '', $berat));
        update_post_meta($post_id, '_jenis_kelamin', $kelamin);
        update_post_meta($post_id, '_tanggal_lahir', $tgl_lahir);
        update_post_meta($post_id, '_no_wa', $no_wa);
    }

    // Berikan laporan lengkap ke layar admin
    wp_send_json_success("Selesai! $count_new atlet baru ditambahkan, dan $count_update data atlet lama berhasil diperbarui/dikoreksi.");
}

// ==========================================
// 11. SISTEM REKAPITULASI JUARA (HALL OF FAME)
// ==========================================

// A. Tambahkan Menu Sub-Halaman "Daftar Juara"
// Menu Daftar Juara
function mma_add_winner_menu() {
    // Ubah manage_options menjadi manage_administrasi
    add_submenu_page('edit.php?post_type=mma_atlet', 'Daftar Juara', '👑 Daftar Juara', 'manage_administrasi', 'mma-daftar-juara', 'mma_render_winner_page');
}
add_action('admin_menu', 'mma_add_winner_menu');

// B. Logika dan Tampilan Halaman Daftar Juara
function mma_render_winner_page() {
    // 1. Ambil Database Bagan Pertandingan
    $all_brackets = get_option('mma_all_brackets', array());

    // 2. Hitung Ulang Pemetaan Kelas (Agar sesuai dengan ID MD5 di Drawing)
    $args = array( 'post_type' => 'mma_atlet', 'posts_per_page' => -1, 'post_status' => 'publish' );
    $atlet_posts = get_posts($args);
    $grouped_data = array();

    foreach ($atlet_posts as $post) {
        $id = $post->ID;
        $tgl_lahir = get_post_meta($id, '_tanggal_lahir', true);
        $jk = get_post_meta($id, '_jenis_kelamin', true);
        $berat = floatval(get_post_meta($id, '_berat_badan', true));
        $kat_tanding = get_post_meta($id, '_kategori_tanding', true);

        if (empty($tgl_lahir) || empty($berat) || empty($jk) || empty($kat_tanding)) continue; 

        $birthDate = new DateTime($tgl_lahir);
        $eventDate = new DateTime('2026-04-30'); // CUT-OFF DIPERBARUI
        $age = $birthDate->diff($eventDate)->y;

        $kategori_usia = ''; $kelas_berat = '';

        if ($age >= 7 && $age < 13) {
            $kategori_usia = 'Pra-Remaja';
            if ($berat <= 25) $kelas_berat = 'Under 25 kg'; elseif ($berat <= 28) $kelas_berat = 'Under 28 kg'; elseif ($berat <= 31) $kelas_berat = 'Under 31 kg'; elseif ($berat <= 34) $kelas_berat = 'Under 34 kg'; elseif ($berat <= 37) $kelas_berat = 'Under 37 kg'; elseif ($berat <= 40) $kelas_berat = 'Under 40 kg'; else $kelas_berat = 'Over 40 kg';
        } elseif ($age >= 13 && $age < 17) {
            $kategori_usia = 'Remaja';
            if ($berat <= 43) $kelas_berat = 'Under 43 kg'; elseif ($berat <= 46) $kelas_berat = 'Under 46 kg'; elseif ($berat <= 49) $kelas_berat = 'Under 49 kg'; elseif ($berat <= 52) $kelas_berat = 'Under 52 kg'; elseif ($berat <= 55) $kelas_berat = 'Under 55 kg'; elseif ($berat <= 58) $kelas_berat = 'Under 58 kg'; else $kelas_berat = 'Over 58 kg';
        } elseif ($age >= 17) {
            $kategori_usia = 'Senior';
            if ($berat <= 55) $kelas_berat = 'Under 55 kg'; elseif ($berat <= 58) $kelas_berat = 'Under 58 kg'; elseif ($berat <= 61) $kelas_berat = 'Under 61 kg'; elseif ($berat <= 64) $kelas_berat = 'Under 64 kg'; elseif ($berat <= 67) $kelas_berat = 'Under 67 kg'; elseif ($berat <= 70) $kelas_berat = 'Under 70 kg'; elseif ($berat <= 73) $kelas_berat = 'Under 73 kg'; else $kelas_berat = 'Over 73 kg';
        } else { continue; }

        // Kita hanya butuh wadahnya saja untuk melacak group_id
        $grouped_data[$jk][$kat_tanding][$kategori_usia][$kelas_berat] = true;
    }

    // 3. Render HTML & CSS
    echo '<div class="wrap mma-winner-wrap">';
    echo '<h1 class="main-title">👑 DAFTAR JUARA (HALL OF FAME)</h1>';
    echo '<p style="font-size: 1.1rem; color: #ccc; margin-bottom: 30px;">Daftar di bawah ini diperbarui secara otomatis secara <em>real-time</em> setiap kali Anda menetapkan pemenang (SANG JUARA) di menu Drawing Match.</p>';

    if (empty($grouped_data)) { echo '<div class="notice notice-warning"><p>Belum ada kelas pertandingan yang terbentuk.</p></div></div>'; return; }

    echo '<style>
        .mma-winner-wrap { background: #070707; color: #fff; padding: 20px; font-family: Inter, sans-serif; }
        .main-title { font-family: Teko, sans-serif; font-size: 2.8rem; color: #FFD700; border-bottom: 2px solid #FFD700; padding-bottom: 10px; margin-bottom: 10px; text-shadow: 0 0 15px rgba(255,215,0,0.3); }
        
        .winner-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; background: #111; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
        .winner-table th { background: #222; color: #e50914; font-family: Teko, sans-serif; font-size: 1.5rem; padding: 15px; text-align: left; border-bottom: 3px solid #e50914; text-transform: uppercase; letter-spacing: 1px;}
        .winner-table td { padding: 15px; border-bottom: 1px solid #333; font-size: 1.1rem; vertical-align: middle; }
        .winner-table tr:hover { background: #1a1a1a; }
        
        .group-header td { background: #0a0a0a; color: #FFD700; font-family: Teko, sans-serif; font-size: 1.8rem; border-left: 5px solid #FFD700; padding: 10px 15px; }
        
        .champ-name { font-weight: bold; color: #fff; font-size: 1.3rem; display: block; margin-bottom: 3px; }
        .champ-team { color: #aaa; font-size: 0.9rem; text-transform: uppercase; }
        
        .status-pending { color: #555; font-style: italic; }
        .status-won { color: #FFD700; font-weight: bold; background: rgba(255,215,0,0.1); padding: 5px 10px; border-radius: 4px; border: 1px solid #FFD700; display: inline-block;}
    </style>';

    // 4. Looping untuk menampilkan tabel
    foreach (array('Laki-laki', 'Perempuan') as $jk) {
        if (!isset($grouped_data[$jk])) continue;

        foreach (array('Assaut', 'Combat') as $kat_tanding) {
            if (!isset($grouped_data[$jk][$kat_tanding])) continue;

            echo '<table class="winner-table">';
            echo '<thead>';
            echo '<tr><th colspan="5" style="background:#e50914; color:#fff; text-align:center; font-size:1.8rem;">' . esc_html(strtoupper($jk)) . ' - ' . esc_html(strtoupper($kat_tanding)) . '</th></tr>';
            echo '<tr>';
            echo '<th width="20%">Kategori Usia</th>';
            echo '<th width="20%">Kelas Berat</th>';
            echo '<th width="30%">Nama Atlet (Juara 1)</th>';
            echo '<th width="20%">Asal Sasana / Tim</th>';
            echo '<th width="10%">Status</th>';
            echo '</tr>';
            echo '</thead>';
            echo '<tbody>';

            foreach (array('Pra-Remaja', 'Remaja', 'Senior') as $usia) {
                if (!isset($grouped_data[$jk][$kat_tanding][$usia])) continue;
                
                $kelas_data = $grouped_data[$jk][$kat_tanding][$usia];
                ksort($kelas_data); // Urutkan kelas

                foreach ($kelas_data as $kelas => $is_exist) {
                    $group_id = md5($jk.$kat_tanding.$usia.$kelas);
                    
                    // Tarik data juara dari Database Bracket
                    $champ = null;
                    if (isset($all_brackets[$group_id]) && isset($all_brackets[$group_id]['champion'])) {
                        $champ = $all_brackets[$group_id]['champion'];
                    }

                    echo '<tr>';
                    echo '<td><strong style="color:#ccc;">' . esc_html($usia) . '</strong></td>';
                    echo '<td style="color:#e50914; font-weight:bold;">' . esc_html($kelas) . '</td>';
                    
                    if (is_array($champ)) {
                        // Jika ada juara
                        echo '<td>';
                        echo '<span class="champ-name">🏆 ' . esc_html($champ['nama']) . '</span>';
                        echo '</td>';
                        echo '<td><span class="champ-team">' . esc_html($champ['tim']) . '</span></td>';
                        echo '<td><span class="status-won">SELESAI</span></td>';
                    } else {
                        // Jika belum ada juara / belum dicentang di Final
                        echo '<td colspan="2"><span class="status-pending">Tanding Belum Selesai / Menunggu Pemenang...</span></td>';
                        echo '<td><span class="status-pending" style="color:#888;">PENDING</span></td>';
                    }
                    echo '</tr>';
                }
            }
            echo '</tbody></table>';
        }
    }
    echo '</div>'; // End Wrap
}

// ==========================================
// 12. SHORTCODE UNTUK DAFTAR JUARA DI FRONTEND
// ==========================================
function mma_frontend_winner_shortcode() {
    // Mulai merekam output HTML
    ob_start();

    $all_brackets = get_option('mma_all_brackets', array());
    $args = array( 'post_type' => 'mma_atlet', 'posts_per_page' => -1, 'post_status' => 'publish' );
    $atlet_posts = get_posts($args);
    $grouped_data = array();

    // Petakan kelas yang tersedia
    foreach ($atlet_posts as $post) {
        $id = $post->ID;
        $tgl_lahir = get_post_meta($id, '_tanggal_lahir', true);
        $jk = get_post_meta($id, '_jenis_kelamin', true);
        $berat = floatval(get_post_meta($id, '_berat_badan', true));
        $kat_tanding = get_post_meta($id, '_kategori_tanding', true);

        if (empty($tgl_lahir) || empty($berat) || empty($jk) || empty($kat_tanding)) continue; 

        $birthDate = new DateTime($tgl_lahir);
        $eventDate = new DateTime('2026-04-30'); // CUT-OFF DIPERBARUI
        $age = $birthDate->diff($eventDate)->y;

        $kategori_usia = ''; $kelas_berat = '';

        if ($age >= 7 && $age < 13) {
            $kategori_usia = 'Pra-Remaja';
            if ($berat <= 25) $kelas_berat = 'Under 25 kg'; elseif ($berat <= 28) $kelas_berat = 'Under 28 kg'; elseif ($berat <= 31) $kelas_berat = 'Under 31 kg'; elseif ($berat <= 34) $kelas_berat = 'Under 34 kg'; elseif ($berat <= 37) $kelas_berat = 'Under 37 kg'; elseif ($berat <= 40) $kelas_berat = 'Under 40 kg'; else $kelas_berat = 'Over 40 kg';
        } elseif ($age >= 13 && $age < 17) {
            $kategori_usia = 'Remaja';
            if ($berat <= 43) $kelas_berat = 'Under 43 kg'; elseif ($berat <= 46) $kelas_berat = 'Under 46 kg'; elseif ($berat <= 49) $kelas_berat = 'Under 49 kg'; elseif ($berat <= 52) $kelas_berat = 'Under 52 kg'; elseif ($berat <= 55) $kelas_berat = 'Under 55 kg'; elseif ($berat <= 58) $kelas_berat = 'Under 58 kg'; else $kelas_berat = 'Over 58 kg';
        } elseif ($age >= 17) {
            $kategori_usia = 'Senior';
            if ($berat <= 55) $kelas_berat = 'Under 55 kg'; elseif ($berat <= 58) $kelas_berat = 'Under 58 kg'; elseif ($berat <= 61) $kelas_berat = 'Under 61 kg'; elseif ($berat <= 64) $kelas_berat = 'Under 64 kg'; elseif ($berat <= 67) $kelas_berat = 'Under 67 kg'; elseif ($berat <= 70) $kelas_berat = 'Under 70 kg'; elseif ($berat <= 73) $kelas_berat = 'Under 73 kg'; else $kelas_berat = 'Over 73 kg';
        } else { continue; }

        $grouped_data[$jk][$kat_tanding][$kategori_usia][$kelas_berat] = true;
    }

    if (empty($grouped_data)) {
        echo '<div style="background:#111; padding:20px; border-left:4px solid #e50914; color:#ccc;">Belum ada data pertandingan yang berlangsung.</div>';
        return ob_get_clean();
    }

    // CSS Khusus Frontend (Responsif)
    echo '<style>
        .fe-winner-wrapper { margin: 40px 0; }
        .fe-winner-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; background: #0a0a0a; border: 1px solid #333; }
        .fe-winner-table th { background: #111; color: var(--red-neon, #e50914); font-family: var(--font-heading, "Teko", sans-serif); font-size: 1.5rem; padding: 15px; text-align: left; border-bottom: 2px solid var(--red-neon, #e50914); letter-spacing: 1px; text-transform: uppercase;}
        .fe-winner-table td { padding: 12px 15px; border-bottom: 1px solid #222; font-size: 1rem; color: #ddd; vertical-align: middle; }
        .fe-winner-table tr:hover { background: #141414; }
        .fe-champ-name { font-weight: bold; color: #fff; font-size: 1.2rem; display: block; margin-bottom: 2px; }
        .fe-champ-team { color: #888; font-size: 0.85rem; text-transform: uppercase; }
        .fe-status-pending { color: #555; font-style: italic; }
        .fe-medal { color: #FFD700; font-size: 1.2rem; margin-right: 5px; }
        .fe-table-responsive { overflow-x: auto; }
        
        @media (max-width: 768px) {
            .fe-winner-table th, .fe-winner-table td { padding: 10px; font-size: 0.9rem; }
            .fe-champ-name { font-size: 1.1rem; }
        }
    </style>';

    echo '<div class="fe-winner-wrapper">';
    echo '<h3 style="color:var(--text-main); font-size: 2.8rem; text-align:center; margin-bottom: 30px; border-bottom: 1px dashed #333; padding-bottom: 20px;">HALL OF FAME: SANG PENAKLUK ARENA</h3>';

    foreach (array('Laki-laki', 'Perempuan') as $jk) {
        if (!isset($grouped_data[$jk])) continue;

        foreach (array('Assaut', 'Combat') as $kat_tanding) {
            if (!isset($grouped_data[$jk][$kat_tanding])) continue;

            echo '<div class="fe-table-responsive">';
            echo '<table class="fe-winner-table">';
            echo '<thead>';
            echo '<tr><th colspan="4" style="background:#1a1a1a; color:#fff; text-align:center; font-size:1.6rem;">' . esc_html(strtoupper($jk)) . ' - ' . esc_html(strtoupper($kat_tanding)) . '</th></tr>';
            echo '<tr>';
            echo '<th width="20%">Kategori Usia</th>';
            echo '<th width="20%">Kelas Berat</th>';
            echo '<th width="35%">Peraih Medali Emas</th>';
            echo '<th width="25%">Asal Sasana / Tim</th>';
            echo '</tr>';
            echo '</thead>';
            echo '<tbody>';

            foreach (array('Pra-Remaja', 'Remaja', 'Senior') as $usia) {
                if (!isset($grouped_data[$jk][$kat_tanding][$usia])) continue;
                
                $kelas_data = $grouped_data[$jk][$kat_tanding][$usia];
                ksort($kelas_data);

                foreach ($kelas_data as $kelas => $is_exist) {
                    $group_id = md5($jk.$kat_tanding.$usia.$kelas);
                    $champ = isset($all_brackets[$group_id]['champion']) ? $all_brackets[$group_id]['champion'] : null;

                    echo '<tr>';
                    echo '<td><strong style="color:#aaa;">' . esc_html($usia) . '</strong></td>';
                    echo '<td style="color:var(--red-neon, #e50914); font-weight:bold;">' . esc_html($kelas) . '</td>';
                    
                    if (is_array($champ)) {
                        echo '<td><span class="fe-champ-name"><span class="fe-medal">🏆</span> ' . esc_html($champ['nama']) . '</span></td>';
                        echo '<td><span class="fe-champ-team">' . esc_html($champ['tim']) . '</span></td>';
                    } else {
                        echo '<td colspan="2"><span class="fe-status-pending">Menunggu Hasil Pertandingan...</span></td>';
                    }
                    echo '</tr>';
                }
            }
            echo '</tbody></table>';
            echo '</div>';
        }
    }
    echo '</div>';

    // Kembalikan output HTML
    return ob_get_clean();
}
add_shortcode('mma_daftar_juara', 'mma_frontend_winner_shortcode');

// ==========================================
// 13. SHORTCODE UNTUK BAGAN PERTANDINGAN DI FRONTEND (DENGAN SEARCH & PAGINATION)
// ==========================================
function mma_frontend_bracket_shortcode() {
    ob_start();

    // 1. Ambil Data Bagan dari Database
    $all_brackets = get_option('mma_all_brackets', array());
    
    // 2. Petakan Kelas & Label
    $args = array( 'post_type' => 'mma_atlet', 'posts_per_page' => -1, 'post_status' => 'publish' );
    $atlet_posts = get_posts($args);
    $grouped_data = array();

    foreach ($atlet_posts as $post) {
        $id = $post->ID;
        $nama = strtoupper($post->post_title);
        $tim = strtoupper(get_post_meta($id, '_asal_tim', true) ?: 'INDEPENDEN');
        $tgl_lahir = get_post_meta($id, '_tanggal_lahir', true);
        $jk = get_post_meta($id, '_jenis_kelamin', true);
        $berat = floatval(get_post_meta($id, '_berat_badan', true));
        $kat_tanding = get_post_meta($id, '_kategori_tanding', true);
        $status_aktif = get_post_meta($id, '_status_aktif', true);

        if (empty($tgl_lahir) || empty($berat) || empty($jk) || empty($kat_tanding) || $status_aktif == 'no') continue; 

        $birthDate = new DateTime($tgl_lahir);
        $eventDate = new DateTime('2026-04-30'); 
        $age = $birthDate->diff($eventDate)->y;

        $kategori_usia = ''; $kelas_berat = '';

        if ($age >= 7 && $age < 13) {
            $kategori_usia = 'Pra-Remaja';
            if ($berat <= 25) $kelas_berat = 'Under 25 kg'; elseif ($berat <= 28) $kelas_berat = 'Under 28 kg'; elseif ($berat <= 31) $kelas_berat = 'Under 31 kg'; elseif ($berat <= 34) $kelas_berat = 'Under 34 kg'; elseif ($berat <= 37) $kelas_berat = 'Under 37 kg'; elseif ($berat <= 40) $kelas_berat = 'Under 40 kg'; else $kelas_berat = 'Over 40 kg';
        } elseif ($age >= 13 && $age < 17) {
            $kategori_usia = 'Remaja';
            if ($berat <= 43) $kelas_berat = 'Under 43 kg'; elseif ($berat <= 46) $kelas_berat = 'Under 46 kg'; elseif ($berat <= 49) $kelas_berat = 'Under 49 kg'; elseif ($berat <= 52) $kelas_berat = 'Under 52 kg'; elseif ($berat <= 55) $kelas_berat = 'Under 55 kg'; elseif ($berat <= 58) $kelas_berat = 'Under 58 kg'; else $kelas_berat = 'Over 58 kg';
        } elseif ($age >= 17) {
            $kategori_usia = 'Senior';
            if ($berat <= 55) $kelas_berat = 'Under 55 kg'; elseif ($berat <= 58) $kelas_berat = 'Under 58 kg'; elseif ($berat <= 61) $kelas_berat = 'Under 61 kg'; elseif ($berat <= 64) $kelas_berat = 'Under 64 kg'; elseif ($berat <= 67) $kelas_berat = 'Under 67 kg'; elseif ($berat <= 70) $kelas_berat = 'Under 70 kg'; elseif ($berat <= 73) $kelas_berat = 'Under 73 kg'; else $kelas_berat = 'Over 73 kg';
        } else { continue; }

        $grouped_data[$jk][$kat_tanding][$kategori_usia][$kelas_berat][] = array('nama' => $nama, 'tim' => $tim);
    }

    // Fungsi Pemecah Pool (Sama seperti di admin)
    $grouped_data = mma_process_grouped_data($grouped_data);

    if (empty($grouped_data)) {
        echo '<div style="background:#111; padding:20px; border-left:4px solid var(--red-neon); color:#ccc;">Bagan pertandingan belum tersedia.</div>';
        return ob_get_clean();
    }

    // 3. CSS KHUSUS FRONTEND UNTUK BAGAN & KONTROL
    echo '<style>
        .fe-bracket-section { margin: 60px 0; font-family: var(--font-body, "Inter", sans-serif); }
        .fe-bracket-title { color: var(--text-main); font-size: 3rem; text-align: center; margin-bottom: 20px; font-family: var(--font-heading, "Teko", sans-serif); border-bottom: 1px dashed #333; padding-bottom: 20px;}
        .fe-drawing-controls { margin-bottom: 40px; text-align: center; }
        .fe-search-input { width: 100%; max-width: 600px; padding: 15px 20px !important; font-size: 1.2rem !important; background: #111 !important; border: 1px solid #444 !important; color: #fff !important; border-radius: 30px; transition: 0.3s;}
        .fe-search-input:focus { border-color: #e50914 !important; outline: none !important; box-shadow: 0 0 15px rgba(229,9,20,0.3) !important;}
        .fe-pagination-wrapper { display: flex; justify-content: center; gap: 15px; margin-top: 40px; padding-top: 30px; border-top: 1px solid #333; align-items: center; flex-wrap: wrap; }
        .fe-page-btn { background: #222; color: #fff; border: 1px solid #444; padding: 10px 20px; cursor: pointer; border-radius: 4px; font-family: var(--font-heading, "Teko", sans-serif); font-size: 1.5rem; letter-spacing: 1px; transition: 0.2s; flex: 1; max-width: 200px; text-align: center; white-space: nowrap; }
        .fe-page-btn:hover { background: #e50914; border-color: #e50914;}
        .fe-page-info { color: #888; font-size: 1.1rem; text-align: center; }
        .fe-gender-title { color: #fff; background: #e50914; padding: 10px 20px; font-family: var(--font-heading, "Teko", sans-serif); font-size: 2rem; display: inline-block; margin-bottom: 20px; letter-spacing: 1px;}
        .fe-kelas-wrapper { background: #0a0a0a; border: 1px solid #333; margin-bottom: 40px; padding: 20px; overflow-x: auto; }
        .fe-kelas-header { background: #111; color: #fff; text-align: center; padding: 15px; font-family: var(--font-heading, "Teko", sans-serif); font-size: 1.6rem; margin-bottom: 30px; border-bottom: 2px solid #333; }
        .fe-bracket { display: flex; flex-direction: row; gap: 80px; align-items: center; min-width: max-content; padding-right: 50px; padding-bottom: 20px;}
        .fe-round { display: flex; flex-direction: column; gap: 30px; justify-content: center; }
        .fe-round-title { font-family: var(--font-heading, "Teko", sans-serif); font-size: 1.4rem; color: #e50914; text-align: center; margin-bottom: 15px; letter-spacing: 1px;}
        .fe-match-pair { position: relative; display: flex; flex-direction: column; gap: 10px; width: 260px; }
        .fe-atlet-card { background: #000; border: 1px solid #333; padding: 12px 15px; position: relative; box-sizing: border-box; height: 75px; display: flex; flex-direction: column; justify-content: center; }
        .fe-atlet-nama { font-family: var(--font-heading, "Teko", sans-serif); font-size: 1.3rem; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; margin-bottom: 3px; color: #fff;}
        .fe-atlet-info { font-size: 0.75rem; color: #888; text-transform: uppercase; }
        .fe-corner-blue { border-left: 5px solid #0066ff !important; }
        .fe-corner-red { border-left: 5px solid #ff0000 !important; }
        .fe-label-sudut { position: absolute; font-family: var(--font-heading, "Teko", sans-serif); font-size: 0.8rem; letter-spacing: 1px; }
        .fe-label-biru { top: -20px; left: 0; color: #0066ff; }
        .fe-label-merah { bottom: -20px; left: 0; color: #ff0000; }
        .fe-ranting-biru { position: absolute; top: 25%; right: -40px; width: 40px; height: 25%; border-top: 2px solid #0066ff; border-right: 2px solid #0066ff; border-top-right-radius: 5px; }
        .fe-ranting-merah { position: absolute; bottom: 25%; right: -40px; width: 40px; height: 25%; border-bottom: 2px solid #ff0000; border-right: 2px solid #ff0000; border-bottom-right-radius: 5px; }
        .fe-ranting-lanjut { position: absolute; top: 50%; right: -80px; width: 25px; border-top: 2px solid #555; }
        .fe-match-number { position: absolute; top: 50%; right: -55px; transform: translateY(-50%); background: #222; border: 1px solid #e50914; color: #fff; font-family: var(--font-heading, "Teko", sans-serif); font-size: 1rem; padding: 2px 8px; z-index: 5; border-radius: 4px;}
        .fe-final-number { right: -30px; border-color: #fff; background: #e50914;}
        .fe-pending-card { border-style: dashed !important; border-color: #444 !important; background: transparent !important; }
        .fe-pending-card .fe-atlet-nama { color: #555 !important; }
        .fe-bye-card { border-style: dashed !important; border-color: #444 !important; background: transparent !important; }
        .fe-bye-card .fe-atlet-nama { color: #555 !important; }
        .fe-champion-card { background: rgba(255,215,0,0.1) !important; border-color: #FFD700 !important; box-shadow: 0 0 15px rgba(255,215,0,0.2) !important; min-height: 85px; }
        .fe-champion-card .fe-atlet-nama { color: #FFD700 !important; font-size: 1.6rem; text-shadow: 0 0 5px rgba(255,215,0,0.5);}

        @media (max-width: 600px) {
            .fe-pagination-wrapper { gap: 10px; flex-direction: row; }
            .fe-page-info { width: 100%; order: -1; margin-bottom: 5px; }
            .fe-page-btn { font-size: 1.3rem; padding: 8px 10px; max-width: none; }
        }
    </style>';

    echo '<div class="fe-bracket-section">';
    echo '<h3 class="fe-bracket-title">LIVE DRAWING & BAGAN PERTANDINGAN</h3>';

    // SEARCH BAR
    echo '<div class="fe-drawing-controls">';
    echo '<input type="text" id="fe-searchBagan" placeholder="🔍 Cari Nama Atlet atau Sasana Anda di sini..." class="fe-search-input">';
    echo '</div>';

    $match_counter = 1;

    foreach (array('Laki-laki', 'Perempuan') as $jk) {
        if (!isset($grouped_data[$jk])) continue;
        
        echo '<div class="fe-gender-block">'; // WRAPPER GENDER
        echo '<h2 class="fe-gender-title">🚻 ' . esc_html(strtoupper($jk)) . '</h2>';

        foreach (array('Assaut', 'Combat') as $kat_tanding) {
            if (!isset($grouped_data[$jk][$kat_tanding])) continue;

            foreach (array('Pra-Remaja', 'Remaja', 'Senior') as $usia) {
                if (!isset($grouped_data[$jk][$kat_tanding][$usia])) continue;
                
                $kelas_data = $grouped_data[$jk][$kat_tanding][$usia];
                ksort($kelas_data);

                foreach ($kelas_data as $kelas => $is_exist) {
                    $group_id = md5($jk.$kat_tanding.$usia.$kelas);

                    if (!isset($all_brackets[$group_id])) continue;
                    
                    $rounds_data = $all_brackets[$group_id];
                    $total_rounds = count($rounds_data) - 1; 

                    // CLASS WRAPPER DENGAN DATA-SEARCH
                    $json_search_data = htmlspecialchars(json_encode($is_exist), ENT_QUOTES, 'UTF-8');
                    echo '<div class="fe-kelas-wrapper" data-search="'.$json_search_data.'">';
                    echo '<div class="fe-kelas-header">USIA: '.esc_html($usia).' | KELAS: ' . esc_html($kelas) . ' <strong style="color:#FFD700; margin-left:10px;">' . strtoupper($kat_tanding) . '</strong></div>';

                    echo '<div class="fe-bracket">';
                    
                    // Render Ronde
                    for ($r = 1; $r <= $total_rounds; $r++) {
                        $is_final = ($r == $total_rounds);
                        echo '<div class="fe-round">';
                        echo '<div class="fe-round-title">' . ($is_final ? 'FINAL' : 'RONDE '.$r) . '</div>';

                        foreach ($rounds_data[$r] as $idx => $match) {
                            echo '<div class="fe-match-pair">';

                            // --- SUDUT BIRU ---
                            $biru = $match['biru'];
                            $is_bye_biru = ($biru === 'BYE');
                            $is_pending_biru = (is_string($biru) && strpos($biru, 'Pemenang Partai') !== false);
                            
                            echo '<div class="fe-atlet-card fe-corner-blue ' . ($is_bye_biru ? 'fe-bye-card' : ($is_pending_biru ? 'fe-pending-card' : '')) . '">';
                            echo '<div class="fe-label-sudut fe-label-biru">SUDUT BIRU</div>';
                            if (is_array($biru)) {
                                echo '<strong class="fe-atlet-nama">'.esc_html($biru['nama']).'</strong>';
                                echo '<div class="fe-atlet-info">'.esc_html($biru['tim']).'</div>';
                            } else {
                                echo '<strong class="fe-atlet-nama" style="text-align:center;">'.esc_html($biru).'</strong>';
                            }
                            echo '</div>';

                            // --- RANTING & NO PARTAI ---
                            echo '<div class="fe-ranting-biru"></div><div class="fe-ranting-merah"></div>';
                            if (!$is_final) {
                                echo '<div class="fe-match-number">No. ' . $match_counter++ . '</div><div class="fe-ranting-lanjut"></div>';
                            } else {
                                echo '<div class="fe-match-number fe-final-number">No. ' . $match_counter++ . '</div>';
                            }

                            // --- SUDUT MERAH ---
                            $merah = $match['merah'];
                            $is_bye_merah = ($merah === 'BYE');
                            $is_pending_merah = (is_string($merah) && strpos($merah, 'Pemenang Partai') !== false);

                            echo '<div class="fe-atlet-card fe-corner-red ' . ($is_bye_merah ? 'fe-bye-card' : ($is_pending_merah ? 'fe-pending-card' : '')) . '">';
                            if (is_array($merah)) {
                                echo '<strong class="fe-atlet-nama">'.esc_html($merah['nama']).'</strong>';
                                echo '<div class="fe-atlet-info">'.esc_html($merah['tim']).'</div>';
                            } else {
                                echo '<strong class="fe-atlet-nama" style="text-align:center;">'.esc_html($merah).'</strong>';
                            }
                            echo '<div class="fe-label-sudut fe-label-merah">SUDUT MERAH</div>';
                            echo '</div>';

                            echo '</div>'; // End match-pair
                        }
                        echo '</div>'; // End round
                    }

                    // --- KOTAK CHAMPION ---
                    $champ = isset($rounds_data['champion']) ? $rounds_data['champion'] : null;
                    $is_champ_active = is_array($champ);

                    echo '<div class="fe-round">';
                    echo '<div class="fe-round-title" style="color:#FFD700;">🏆 SANG JUARA</div>';
                    echo '<div class="fe-match-pair" style="justify-content:center;">';
                    echo '<div class="fe-atlet-card '.($is_champ_active ? 'fe-champion-card' : 'fe-pending-card').'" style="border-width:2px; text-align:center; padding:15px;">';
                    
                    if ($is_champ_active) {
                        echo '<strong class="fe-atlet-nama">'.esc_html($champ['nama']).'</strong>';
                        echo '<div class="fe-atlet-info" style="color:#FFD700; font-weight:bold;">'.esc_html($champ['tim']).'</div>';
                    } else {
                        echo '<strong class="fe-atlet-nama">Menunggu Hasil...</strong>';
                    }
                    
                    echo '</div></div></div>'; 

                    echo '</div>'; // End fe-bracket
                    echo '</div>'; // End fe-kelas-wrapper
                }
            }
        }
        echo '</div>'; // End fe-gender-block
    }
    
    // PAGINATION CONTROLS
    echo '<div class="fe-pagination-wrapper" id="fe-pagination-controls"></div>';
    
    echo '</div>'; // End section

    // 4. JAVASCRIPT FRONT-END (PURE VANILLA JS)
    echo "<script>
    document.addEventListener('DOMContentLoaded', function() {
        var currentPage = 1;
        var itemsPerPage = 3; 
        var allWrappers = Array.from(document.querySelectorAll('.fe-kelas-wrapper'));
        var filteredWrappers = allWrappers.slice();

        function renderPagination() {
            var totalPages = Math.ceil(filteredWrappers.length / itemsPerPage);
            if (totalPages === 0) totalPages = 1;
            if (currentPage > totalPages) currentPage = totalPages;

            allWrappers.forEach(function(el) { el.style.display = 'none'; });
            document.querySelectorAll('.fe-gender-block').forEach(function(el) { el.style.display = 'none'; });

            var start = (currentPage - 1) * itemsPerPage;
            var end = start + itemsPerPage;
            var pageItems = filteredWrappers.slice(start, end);

            pageItems.forEach(function(el) {
                el.style.display = 'block';
                var genderBlock = el.closest('.fe-gender-block');
                if (genderBlock) genderBlock.style.display = 'block';
            });

            var controls = '';
            if(totalPages > 1) {
                controls += '<button class=\"fe-page-btn\" id=\"fe-btn-prev\" '+(currentPage === 1 ? 'disabled style=\"opacity:0.3; cursor:not-allowed;\"' : '')+'>&laquo; KEMBALI</button>';
                controls += '<span class=\"fe-page-info\"> HALAMAN '+currentPage+' DARI '+totalPages+' </span>';
                controls += '<button class=\"fe-page-btn\" id=\"fe-btn-next\" '+(currentPage === totalPages ? 'disabled style=\"opacity:0.3; cursor:not-allowed;\"' : '')+'>LANJUT &raquo;</button>';
            }
            document.getElementById('fe-pagination-controls').innerHTML = controls;
        }

        renderPagination();

        var paginationContainer = document.getElementById('fe-pagination-controls');
        if (paginationContainer) {
            paginationContainer.addEventListener('click', function(e) {
                if (e.target && e.target.id === 'fe-btn-next') {
                    currentPage++; 
                    renderPagination(); 
                    scrollToTop();
                } else if (e.target && e.target.id === 'fe-btn-prev') {
                    currentPage--; 
                    renderPagination(); 
                    scrollToTop();
                }
            });
        }

        function scrollToTop() {
            var titleEl = document.querySelector('.fe-bracket-title');
            if (titleEl) {
                var topPos = titleEl.getBoundingClientRect().top + window.scrollY - 50;
                window.scrollTo({ top: topPos, behavior: 'smooth' });
            }
        }

        var searchInput = document.getElementById('fe-searchBagan');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                var keyword = this.value.toLowerCase();
                
                if(keyword === '') {
                    filteredWrappers = allWrappers.slice();
                } else {
                    filteredWrappers = allWrappers.filter(function(el) {
                        var htmlText = el.textContent.toLowerCase();
                        var dataSearch = el.getAttribute('data-search') || '';
                        return htmlText.includes(keyword) || dataSearch.toLowerCase().includes(keyword);
                    });
                }
                
                currentPage = 1; 
                renderPagination();
            });
        }
    });
    </script>";

    return ob_get_clean();
}
add_shortcode('mma_bagan_pertandingan', 'mma_frontend_bracket_shortcode');

// ==========================================
// 14. CUSTOM COLUMN UNTUK TABEL DAFTAR ATLET DI WP ADMIN (REVISI FILTER & KELAS BB)
// ==========================================

// A. Daftarkan Kolom Tabel
add_filter('manage_mma_atlet_posts_columns', 'mma_clean_table_columns');
function mma_clean_table_columns($columns) {
    return [
        'cb'         => '<input type="checkbox" />',
        'title'      => 'NAMA ATLET',
        'c_pay'      => 'PEMBAYARAN',
        'c_status'   => 'STATUS', 
        'c_sasana'   => 'SASANA',
        'c_jk'       => 'L/P',
        'c_kat'      => 'KATEGORI',
        'c_usia'     => 'KELAS USIA',
        'c_tgl'      => 'LAHIR (UMUR)',
        'c_kelas_bb' => 'KELAS BB',
        'c_berat'    => 'BERAT (KG)',
        'c_wa'       => 'WHATSAPP'
    ];
}

// B. Isi Data ke Dalam Kolom
add_action('manage_mma_atlet_posts_custom_column', 'mma_clean_table_fill', 10, 2);
function mma_clean_table_fill($column, $post_id) {
    $tgl   = get_post_meta($post_id, '_tanggal_lahir', true);
    $jk    = get_post_meta($post_id, '_jenis_kelamin', true);
    $berat = floatval(get_post_meta($post_id, '_berat_badan', true));
    $wa    = get_post_meta($post_id, '_no_wa', true);
    $age   = 0; $lbl = '-'; $clr = '#888'; $kelas_bb = '-';

    if (!empty($tgl)) {
        $birthDate = new DateTime($tgl);
        $eventDate = new DateTime('2026-04-30'); // Cut-off mutlak
        $age = $birthDate->diff($eventDate)->y;
        
        // Kalkulasi Kelas Usia & Warna
        if ($age >= 7 && $age < 13) { $lbl = 'Pra-Remaja'; $clr = '#00ff00'; }
        elseif ($age >= 13 && $age < 17) { $lbl = 'Remaja'; $clr = '#ffff00'; }
        elseif ($age >= 17) { $lbl = 'Senior'; $clr = '#ff9900'; }

        // Kalkulasi Kelas Berat Badan (Kelas BB)
        if ($lbl == 'Pra-Remaja') {
            if ($berat <= 25) $kelas_bb = 'U-25'; elseif ($berat <= 28) $kelas_bb = 'U-28'; elseif ($berat <= 31) $kelas_bb = 'U-31'; elseif ($berat <= 34) $kelas_bb = 'U-34'; elseif ($berat <= 37) $kelas_bb = 'U-37'; elseif ($berat <= 40) $kelas_bb = 'U-40'; else $kelas_bb = '+40';
        } elseif ($lbl == 'Remaja') {
            if ($berat <= 43) $kelas_bb = 'U-43'; elseif ($berat <= 46) $kelas_bb = 'U-46'; elseif ($berat <= 49) $kelas_bb = 'U-49'; elseif ($berat <= 52) $kelas_bb = 'U-52'; elseif ($berat <= 55) $kelas_bb = 'U-55'; elseif ($berat <= 58) $kelas_bb = 'U-58'; else $kelas_bb = '+58';
        } elseif ($lbl == 'Senior') {
            if ($berat <= 49) $kelas_bb = 'U-49'; elseif ($berat <= 52) $kelas_bb = 'U-52'; elseif ($berat <= 55) $kelas_bb = 'U-55'; elseif ($berat <= 58) $kelas_bb = 'U-58'; elseif ($berat <= 61) $kelas_bb = 'U-61'; elseif ($berat <= 64) $kelas_bb = 'U-64'; elseif ($berat <= 67) $kelas_bb = 'U-67'; elseif ($berat <= 70) $kelas_bb = 'U-70'; elseif ($berat <= 73) $kelas_bb = 'U-73'; else $kelas_bb = '+73';
        }
    }

    switch ($column) {
        case 'c_pay': // <--- LOGIKA TAMPILAN BADGE PEMBAYARAN
            $status_bayar = get_post_meta($post_id, '_pay_status', true) ?: 'unpaid';
            if ($status_bayar == 'paid') {
                echo '<span style="background:#00ff00; color:#000; padding:4px 8px; border-radius:3px; font-weight:bold; font-size:11px;">✅ LUNAS</span>';
            } else {
                echo '<span style="background:#ff3333; color:#fff; padding:4px 8px; border-radius:3px; font-weight:bold; font-size:11px;">❌ BELUM BAYAR</span>';
            }
            break;
        case 'c_status': 
            $status = get_post_meta($post_id, '_status_aktif', true);
            if (empty($status)) $status = 'yes';
            $nonce = wp_create_nonce('toggle_status_'.$post_id);
            if ($status == 'no') {
                echo '<span class="status-toggle" data-id="'.$post_id.'" data-nonce="'.$nonce.'" data-current="no" style="cursor:pointer; background:#ff3333; color:#fff; padding:4px 10px; font-size:11px; font-weight:bold; border-radius:3px; display:inline-block; transition:0.2s;" title="Klik untuk mengaktifkan">INACTIVE</span>';
            } else {
                echo '<span class="status-toggle" data-id="'.$post_id.'" data-nonce="'.$nonce.'" data-current="yes" style="cursor:pointer; background:#00ff00; color:#000; padding:4px 10px; font-size:11px; font-weight:bold; border-radius:3px; display:inline-block; transition:0.2s;" title="Klik untuk nonaktifkan">ACTIVE</span>';
            }
            break;
        case 'c_sasana': echo esc_html(get_post_meta($post_id, '_asal_tim', true)); break;
        case 'c_jk':     echo ($jk == 'Laki-laki') ? 'L' : 'P'; break;
        case 'c_kat':    echo esc_html(get_post_meta($post_id, '_kategori_tanding', true)); break;
        case 'c_usia':   echo "<span style='background:$clr; color:#000; padding:2px 5px; font-size:10px; font-weight:bold;'>".strtoupper($lbl)."</span>"; break;
        case 'c_kelas_bb': echo "<strong style='color:#e50914; font-size:1.1rem;'>" . esc_html($kelas_bb) . "</strong>"; break; // TAMPILAN KELAS BB
        case 'c_tgl':    echo "<strong>$tgl</strong><br>($age Thn)"; break;
        case 'c_berat':  echo $berat . ' kg'; break;
        case 'c_wa':     echo !empty($wa) ? "<a href='https://wa.me/".preg_replace('/[^0-9]/','',$wa)."'>$wa</a>" : '-'; break;
    }
}

// C. Tambahkan Dropdown Filter Multi-Lapis
add_action('restrict_manage_posts', 'mma_table_filters');
function mma_table_filters($post_type) {
    if ($post_type !== 'mma_atlet') return;
    global $wpdb;
    
    // 1. Filter Sasana
    $sasanas = $wpdb->get_col("SELECT DISTINCT meta_value FROM {$wpdb->postmeta} WHERE meta_key = '_asal_tim' AND meta_value != '' ORDER BY meta_value ASC");
    echo '<select name="f_sasana"><option value="">Semua Sasana</option>';
    foreach ($sasanas as $s) printf('<option value="%s" %s>%s</option>', esc_attr($s), selected(isset($_GET['f_sasana']) ? $_GET['f_sasana'] : '', $s, false), esc_html($s));
    echo '</select>';

    // 2. Filter Kategori
    $kat_sel = isset($_GET['f_kat']) ? $_GET['f_kat'] : '';
    echo '<select name="f_kat"><option value="">Semua Kategori</option>';
    echo '<option value="Assaut" '.selected($kat_sel, 'Assaut', false).'>Assaut</option>';
    echo '<option value="Combat" '.selected($kat_sel, 'Combat', false).'>Combat</option>';
    echo '</select>';

    // 3. Filter Jenis Kelamin
    $jk_sel = isset($_GET['f_jk']) ? $_GET['f_jk'] : '';
    echo '<select name="f_jk"><option value="">Semua L/P</option>';
    echo '<option value="Laki-laki" '.selected($jk_sel, 'Laki-laki', false).'>Laki-laki</option>';
    echo '<option value="Perempuan" '.selected($jk_sel, 'Perempuan', false).'>Perempuan</option>';
    echo '</select>';

    // 4. Filter Kelas Usia
    $usia_sel = isset($_GET['f_usia']) ? $_GET['f_usia'] : '';
    echo '<select name="f_usia"><option value="">Semua Usia</option>';
    echo '<option value="pra" '.selected($usia_sel, 'pra', false).'>Pra-Remaja</option>';
    echo '<option value="rem" '.selected($usia_sel, 'rem', false).'>Remaja</option>';
    echo '<option value="sen" '.selected($usia_sel, 'sen', false).'>Senior</option>';
    echo '</select>';
}

// D. Eksekusi Logika Filter di Database WordPress
add_action('pre_get_posts', 'mma_atlet_filter_query');
function mma_atlet_filter_query($query) {
    global $pagenow;
    if (is_admin() && $pagenow == 'edit.php' && isset($_GET['post_type']) && $_GET['post_type'] == 'mma_atlet' && $query->is_main_query()) {
        $meta_query = array();

        if (!empty($_GET['f_sasana'])) {
            $meta_query[] = array('key' => '_asal_tim', 'value' => sanitize_text_field($_GET['f_sasana']));
        }
        if (!empty($_GET['f_kat'])) {
            $meta_query[] = array('key' => '_kategori_tanding', 'value' => sanitize_text_field($_GET['f_kat']));
        }
        if (!empty($_GET['f_jk'])) {
            $meta_query[] = array('key' => '_jenis_kelamin', 'value' => sanitize_text_field($_GET['f_jk']));
        }
        
        // Logika Ekstraksi Usia (Berdasarkan Rentang Tanggal Lahir untuk Cut-off 30 April 2026)
        if (!empty($_GET['f_usia'])) {
            $usia = $_GET['f_usia'];
            if ($usia == 'pra') {
                $meta_query[] = array(
                    'key' => '_tanggal_lahir',
                    'value' => array('2013-05-01', '2019-04-30'),
                    'compare' => 'BETWEEN',
                    'type' => 'DATE'
                );
            } elseif ($usia == 'rem') {
                $meta_query[] = array(
                    'key' => '_tanggal_lahir',
                    'value' => array('2009-05-01', '2013-04-30'),
                    'compare' => 'BETWEEN',
                    'type' => 'DATE'
                );
            } elseif ($usia == 'sen') {
                $meta_query[] = array(
                    'key' => '_tanggal_lahir',
                    'value' => '2009-04-30',
                    'compare' => '<=', // Lahir sebelum atau pas 30 April 2009
                    'type' => 'DATE'
                );
            }
        }

        // Gabungkan semua filter dengan logika "DAN" (AND)
        if (!empty($meta_query)) {
            $meta_query['relation'] = 'AND';
            $query->set('meta_query', $meta_query);
        }
    }
}

// ==========================================
// 15. GAHR LAYOUT BLOG (GRID 3 KOLOM)
// ==========================================
add_action('wp_head', function() {
    if ( is_home() || is_archive() || is_single() ) {
        ?>
        <style>
            /* Container Utama */
            .kombat-blog-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
                gap: 30px; 
                max-width: 1200px; 
                margin: 50px auto; 
                padding: 0 20px; 
            }

            /* Kartu Artikel */
            .kombat-card {
                background: #111;
                border: 1px solid #222;
                position: relative;
                overflow: hidden;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                display: flex;
                flex-direction: column;
                text-decoration: none;
            }

            .kombat-card:hover {
                transform: translateY(-10px);
                border-color: #e50914;
                box-shadow: 0 10px 30px rgba(229, 9, 20, 0.2);
            }

            /* Thumbnail dengan Overlay Merah */
            .kombat-thumb-wrapper {
                position: relative;
                height: 220px;
                overflow: hidden;
            }

            .kombat-thumb-wrapper img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: 0.5s;
            }

            .kombat-card:hover .kombat-thumb-wrapper img {
                transform: scale(1.1) rotate(1deg);
            }

            .kombat-badge {
                position: absolute;
                top: 15px;
                left: 15px;
                background: #e50914;
                color: #fff;
                font-family: 'Teko', sans-serif;
                padding: 3px 12px;
                font-size: 0.9rem;
                z-index: 2;
                text-transform: uppercase;
            }

            /* Konten Kartu */
            .kombat-card-body {
                padding: 20px;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
            }

            .kombat-meta {
                font-size: 0.75rem;
                color: #888;
                text-transform: uppercase;
                margin-bottom: 10px;
                letter-spacing: 1px;
            }

            .kombat-card-body h2 {
                font-family: 'Teko', sans-serif;
                font-size: 1.8rem;
                color: #fff;
                line-height: 1.1;
                margin: 0 0 15px;
                transition: 0.3s;
            }

            .kombat-card:hover .kombat-card-body h2 {
                color: #e50914;
            }

            .kombat-excerpt {
                color: #aaa;
                font-size: 0.95rem;
                line-height: 1.6;
                margin-bottom: 20px;
            }

            .kombat-card:hover .kombat-btn-more::after {
                transform: translateX(5px);
            }
            
            .mma-share-container { 
            display: flex; 
            align-items: center; 
            gap: 10px; 
            margin: 20px 0; 
            padding: 15px 0;
            border-top: 1px solid #222;
        }
        .share-label { 
            font-family: 'Teko', sans-serif; 
            font-size: 1.2rem; 
            color: #FFD700; 
            letter-spacing: 2px;
        }
        .share-btn { 
            display: inline-flex; 
            align-items: center; 
            justify-content: center; 
            width: 40px; 
            height: 40px; 
            border-radius: 4px; 
            color: #fff; 
            text-decoration: none; 
            font-family: 'Teko', sans-serif; 
            font-weight: bold; 
            transition: 0.3s;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .share-btn.fb { background: #3b5998; }
        .share-btn.wa { background: #25d366; }
        .share-btn.ig { background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); }
        
        .share-btn:hover { 
            transform: translateY(-3px); 
            filter: brightness(1.2); 
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

            /* Responsive */
            @media (max-width: 600px) {
                .kombat-blog-grid { grid-template-columns: 1fr; }
                .mma-share-container { justify-content: center; }
            }
        </style>
        <?php
    }
});

// ==========================================
// 16. SEO, OPEN GRAPH & AUTO THUMBNAIL (FINAL WHATSAPP FIX)
// ==========================================

if ( ! function_exists( 'get_mma_dynamic_thumb' ) ) {
    function get_mma_dynamic_thumb($post_id) {
        // Cek Featured Image (Ukuran Large agar ringan di WA)
        $thumb = get_the_post_thumbnail_url($post_id, 'large');
        
        // Jika kosong, ambil dari isi konten
        if (!$thumb) {
            $post = get_post($post_id);
            if ($post) {
                preg_match_all('/<img.+?src=[\'"]([^\'"]+)[\'"].*?>/i', $post->post_content, $matches);
                $thumb = isset($matches[1][0]) ? $matches[1][0] : '';
            }
        }

        // Jika tetap kosong, gunakan default ring (URL yang valid)
        if (!$thumb) {
            $thumb = "https://images.unsplash.com/photo-1724529808495-8b7cf64e3e3a?q=80&w=1200&auto=format&fit=crop";
        }
        return esc_url($thumb);
    }
}

if ( ! function_exists( 'mma_seo_og_tags' ) ) {
    function mma_seo_og_tags() {
        if (!is_singular() && !is_home() && !is_front_page()) return;

        global $post;
        if (!$post && is_singular()) return;

        $site_name   = get_bloginfo('name');
        $title       = is_singular() ? get_the_title() : get_bloginfo('description');
        $description = is_singular() ? wp_trim_words(strip_tags($post->post_content), 25) : get_bloginfo('description');
        $url         = is_singular() ? get_permalink() : home_url();
        $image       = is_singular() ? get_mma_dynamic_thumb($post->ID) : "https://images.unsplash.com/photo-1724529808495-8b7cf64e3e3a?q=80&w=1200&auto=format&fit=crop";

        echo "\n\n";
        echo '<meta name="description" content="' . esc_attr($description) . '" />' . "\n";
        echo '<link rel="canonical" href="' . esc_url($url) . '" />' . "\n";
        echo '<meta property="og:site_name" content="' . esc_attr($site_name) . '" />' . "\n";
        echo '<meta property="og:title" content="' . esc_attr($title) . '" />' . "\n";
        echo '<meta property="og:description" content="' . esc_attr($description) . '" />' . "\n";
        echo '<meta property="og:url" content="' . esc_url($url) . '" />' . "\n";
        echo '<meta property="og:type" content="article" />' . "\n";
        echo '<meta property="og:image" content="' . $image . '" />' . "\n";
        echo '<meta property="og:image:secure_url" content="' . $image . '" />' . "\n";
        echo '<meta property="og:image:width" content="1200" />' . "\n";
        echo '<meta property="og:image:height" content="630" />' . "\n";
        echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
        echo '<meta name="twitter:image" content="' . $image . '" />' . "\n";
    }
}
add_action('wp_head', 'mma_seo_og_tags', 1);

// ==========================================
// 18. SISTEM KELOLA SPONSOR (DENGAN KATEGORI)
// ==========================================

function mma_add_sponsor_meta_boxes() {
    add_meta_box('mma_sponsor_data', 'MANAJEMEN SPONSOR & PARTNER', 'mma_render_sponsor_boxes', 'page', 'normal', 'high');
}
add_action('add_meta_boxes', 'mma_add_sponsor_meta_boxes');

function mma_render_sponsor_boxes($post) {
    if (get_post_meta($post->ID, '_wp_page_template', true) !== 'page-sponsor.php') {
        echo '<p>Pilih "Template: Halaman Sponsor" untuk mengaktifkan fitur ini.</p>';
        return;
    }

    wp_nonce_field('mma_save_sponsor', 'mma_sponsor_nonce');
    $sponsors = get_post_meta($post->ID, '_mma_sponsors', true) ?: array();
    ?>
    <style>
        .sp-row { background:#fff; padding:15px; border:1px solid #ccc; margin-bottom:10px; display:grid; grid-template-columns: 2fr 1fr 1fr; gap:15px; align-items: end; }
        .sp-row label { display:block; font-weight:bold; margin-bottom:5px; }
    </style>
    <div id="sponsor-container">
        <?php foreach ($sponsors as $index => $sp) : ?>
            <div class="sp-row">
                <div><label>URL Logo</label><input type="text" name="sp_logo[]" value="<?php echo esc_attr($sp['logo']); ?>" style="width:100%"/></div>
                <div><label>Durasi</label><input type="text" name="sp_durasi[]" value="<?php echo esc_attr($sp['durasi']); ?>" style="width:100%"/></div>
                <div><label>Kategori</label>
                    <select name="sp_kat[]" style="width:100%">
                        <option value="platinum" <?php selected($sp['kat'], 'platinum'); ?>>Platinum Partner</option>
                        <option value="gold" <?php selected($sp['kat'], 'gold'); ?>>Gold Partner</option>
                        <option value="silver" <?php selected($sp['kat'], 'silver'); ?>>Silver Partner</option>
                    </select>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    <button type="button" class="button button-primary" onclick="addSponsorRow()">+ Tambah Sponsor</button>

    <script>
        function addSponsorRow() {
            var row = '<div class="sp-row">' +
                '<div><input type="text" name="sp_logo[]" placeholder="URL Logo" style="width:100%"/></div>' +
                '<div><input type="text" name="sp_durasi[]" placeholder="Durasi" style="width:100%"/></div>' +
                '<div><select name="sp_kat[]" style="width:100%"><option value="platinum">Platinum</option><option value="gold">Gold</option><option value="silver">Silver</option></select></div>' +
                '</div>';
            jQuery("#sponsor-container").append(row);
        }
    </script>
    <?php
}

function mma_save_sponsor_meta($post_id) {
    if (!isset($_POST['mma_sponsor_nonce']) || !wp_verify_nonce($_POST['mma_sponsor_nonce'], 'mma_save_sponsor')) return;
    $logos = $_POST['sp_logo'];
    $durasi = $_POST['sp_durasi'];
    $kats = $_POST['sp_kat'];
    $combined = array();
    for ($i = 0; $i < count($logos); $i++) {
        if (!empty($logos[$i])) {
            $combined[] = array('logo' => sanitize_text_field($logos[$i]), 'durasi' => sanitize_text_field($durasi[$i]), 'kat' => sanitize_text_field($kats[$i]));
        }
    }
    update_post_meta($post_id, '_mma_sponsors', $combined);
}
add_action('save_post', 'mma_save_sponsor_meta');

// ==========================================
// 19. GLOBAL SOCIAL SHARE BUTTONS
// ==========================================
function mma_global_share_buttons() {
    $url   = urlencode(get_permalink());
    $title = urlencode(get_the_title());
    $site  = urlencode(get_bloginfo('name'));

    // Link Share
    $facebook_url  = "https://www.facebook.com/sharer/sharer.php?u=$url";
    $whatsapp_url  = "https://api.whatsapp.com/send?text=$title%20-%20$url";
    // Instagram tidak mendukung direct link share via web, jadi kita arahkan ke profil atau info
    $instagram_url = "https://www.instagram.com/"; 

    echo '<div class="mma-share-container">';
    echo '<span class="share-label">SHARE :</span>';
    
    // Facebook
    echo '<a href="'.$facebook_url.'" class="share-btn fb" target="_blank" title="Share ke Facebook">FB</a>';
    
    // WhatsApp
    echo '<a href="'.$whatsapp_url.'" class="share-btn wa" target="_blank" title="Share ke WhatsApp">WA</a>';
    
    // Instagram (Link ke Profil karena batasan API Instagram)
    echo '<a href="'.$instagram_url.'" class="share-btn ig" target="_blank" title="Follow Instagram">IG</a>';
    
    echo '</div>';
}

// ==========================================
// 20. LOGIKA GLOBAL ARTIKEL (GRID 3 & STICKY)
// ==========================================

// Memastikan sticky post muncul di tiap halaman paging
add_action('pre_get_posts', function($query) {
    if (!is_admin() && $query->is_main_query() && (is_home() || is_archive())) {
        // Set post per halaman menjadi 3 atau 6 agar grid 3 kolom selalu penuh
        $query->set('posts_per_page', 6);
        
        // Memastikan sticky posts tidak diabaikan oleh paging
        $query->set('ignore_sticky_posts', false);
    }
});

// Styling Paging (Pagination) Kombat Style
add_filter('navigation_markup_template', function($template) {
    return '
    <nav class="navigation %1$s" role="navigation">
        <div class="nav-links kombat-pagination">%3$s</div>
    </nav>';
}, 10, 2);

// ==========================================
// 21. MODUL KEUANGAN ORGANISASI (KOMBAT FINANCE PRO)
// ==========================================

// A. Inisialisasi Database Kustom untuk Buku Kas
function mma_fin_init_db() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'mma_kas';
    $charset_collate = $wpdb->get_charset_collate();

    // UPDATE V1.1: Penambahan kolom bukti_url
    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        tanggal date NOT NULL,
        jenis varchar(10) NOT NULL,
        nominal bigint(20) NOT NULL,
        coa varchar(100) NOT NULL,
        pos_anggaran varchar(100) NOT NULL,
        keterangan text NOT NULL,
        bukti_url varchar(255) DEFAULT '' NOT NULL,
        waktu datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
    
    if (!get_option('mma_coa_list')) {
        $default_coa = "111 - Kas Tunai\n112 - Rekening Bank\n411 - Pendapatan Pendaftaran\n412 - Pendapatan Sponsor\n413 - Dana Hibah donatur\n511 - Biaya Operasional Sasana\n512 - Biaya Event / Kejuaraan\n513 - Biaya Perlengkapan Atlet";
        update_option('mma_coa_list', $default_coa);
    }
    if (!get_option('mma_pos_list')) {
        $default_pos = "Operasional Rutin\nBupati MAJESTY Cup 1\nUluwatu Fight Night\nKejuaraan Asia Nepal";
        update_option('mma_pos_list', $default_pos);
    }
    // Bump versi ke 1.1 agar trigger pembuatan kolom bukti_url
    update_option('mma_fin_db_version', '1.1');
}

// Jalankan pembuatan/upgrade DB sekali saja
add_action('admin_init', function() {
    if (get_option('mma_fin_db_version') !== '1.1') {
        mma_fin_init_db();
    }
});

// B. Mendaftarkan Menu Keuangan di Dashboard WP
add_action('admin_menu', 'mma_fin_menu');
function mma_fin_menu() {
    add_menu_page('Laporan Keuangan', '💰 Keuangan', 'manage_keuangan', 'mma-fin-dashboard', 'mma_fin_render_dashboard', 'dashicons-money-alt', 4);
    add_submenu_page('mma-fin-dashboard', 'Dashboard Keuangan', 'Dashboard', 'manage_keuangan', 'mma-fin-dashboard', 'mma_fin_render_dashboard');
    add_submenu_page('mma-fin-dashboard', 'Buku Kas', 'Buku Kas (In/Out)', 'manage_keuangan', 'mma-fin-kas', 'mma_fin_render_kas');
    add_submenu_page('mma-fin-dashboard', 'Master Data', 'Master COA & Pos', 'manage_keuangan', 'mma-fin-master', 'mma_fin_render_master');
}

// CSS Khusus Modul Keuangan
function mma_fin_css() {
    echo '<style>
        .fin-wrap { font-family: "Inter", sans-serif; background: #0a0a0a; color: #fff; padding: 20px; border: 1px solid #333; margin-top: 15px; border-top: 4px solid #FFD700; }
        .fin-title { font-family: "Teko", sans-serif; font-size: 2.5rem; color: #FFD700; border-bottom: 1px dashed #333; padding-bottom: 10px; margin-bottom: 20px; letter-spacing: 1px;}
        .fin-card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .fin-card { background: #111; border: 1px solid #333; padding: 20px; border-radius: 5px; text-align: center; }
        .fin-card h3 { font-size: 1rem; color: #888; text-transform: uppercase; margin-top: 0; margin-bottom: 10px;}
        .fin-card .val { font-family: "Teko", sans-serif; font-size: 2.8rem; line-height: 1; }
        .val-in { color: #00ff00; } .val-out { color: #ff3333; } .val-saldo { color: #FFD700; }
        
        .fin-form { background: #111; padding: 20px; border: 1px solid #222; margin-bottom: 30px; }
        .fin-form-row { display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 15px; }
        .fin-form-group { flex: 1; min-width: 200px; }
        .fin-form label { display: block; font-weight: bold; color: #ccc; margin-bottom: 5px; font-size: 0.9rem;}
        .fin-form input, .fin-form select, .fin-form textarea { width: 100%; padding: 8px; background: #000; color: #fff; border: 1px solid #444; }
        .fin-btn { background: #e50914; color: #fff; border: none; padding: 10px 25px; font-family: "Teko", sans-serif; font-size: 1.3rem; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; transition: 0.3s;}
        .fin-btn:hover { background: #FFD700; color: #000; }
        
        .fin-table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #000; }
        .fin-table th, .fin-table td { padding: 12px; border: 1px solid #222; text-align: left; vertical-align: middle;}
        .fin-table th { background: #1a1a1a; color: #FFD700; font-family: "Teko", sans-serif; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 1px;}
        .fin-table tbody tr:hover { background: #111; }
        .text-right { text-align: right !important; }
        .text-center { text-align: center !important; }
        .badge-masuk { background: rgba(0,255,0,0.1); color: #00ff00; padding: 3px 8px; font-weight: bold; font-size:0.8rem; border-radius: 3px;}
        .badge-keluar { background: rgba(255,0,0,0.1); color: #ff3333; padding: 3px 8px; font-weight: bold; font-size:0.8rem; border-radius: 3px;}
        
        .bukti-thumbnail { width: 45px; height: 45px; object-fit: cover; border: 2px solid #555; border-radius: 4px; transition: 0.2s;}
        .bukti-thumbnail:hover { border-color: #FFD700; transform: scale(1.1);}
    </style>';
}

// C. HALAMAN 1: MASTER DATA (COA & POS ANGGARAN)
function mma_fin_render_master() {
    if (!current_user_can('manage_keuangan')) return;
    
    if (isset($_POST['submit_master']) && check_admin_referer('mma_fin_master_action')) {
        update_option('mma_coa_list', sanitize_textarea_field($_POST['coa_list']));
        update_option('mma_pos_list', sanitize_textarea_field($_POST['pos_list']));
        echo '<div class="notice notice-success is-dismissible"><p>Data Master Berhasil Diperbarui!</p></div>';
    }

    $coa_list = get_option('mma_coa_list');
    $pos_list = get_option('mma_pos_list');
    
    mma_fin_css();
    ?>
    <div class="wrap fin-wrap">
        <h1 class="fin-title">⚙️ MASTER DATA AKUNTANSI</h1>
        <p style="color:#aaa;">Definisikan Chart of Accounts (Buku Besar) dan Pos Anggaran (Proyek/Acara) di sini. Pisahkan dengan enter (baris baru).</p>
        
        <form method="post" class="fin-form">
            <?php wp_nonce_field('mma_fin_master_action'); ?>
            <div class="fin-form-row">
                <div class="fin-form-group">
                    <label>📝 Daftar COA (Kode & Nama Akun)</label>
                    <textarea name="coa_list" rows="12" placeholder="111 - Kas Tunai..."><?php echo esc_textarea($coa_list); ?></textarea>
                    <small style="color:#666;">Format Bebas. Contoh Kaidah: 1xx (Aset/Kas), 4xx (Pendapatan), 5xx (Beban/Biaya).</small>
                </div>
                <div class="fin-form-group">
                    <label>🎯 Daftar Pos Anggaran (Proyek/Event)</label>
                    <textarea name="pos_list" rows="12" placeholder="Operasional Sasana..."><?php echo esc_textarea($pos_list); ?></textarea>
                    <small style="color:#666;">Digunakan untuk melacak laba/rugi per acara (Contoh: Bupati Cup 1).</small>
                </div>
            </div>
            <button type="submit" name="submit_master" class="fin-btn">💾 Simpan Master Data</button>
        </form>
    </div>
    <?php
}

// D. HALAMAN 2: BUKU KAS (INPUT, EDIT, UPLOAD BUKTI & TABEL TRANSAKSI)
function mma_fin_render_kas() {
    if (!current_user_can('manage_keuangan')) return;
    
    // Panggil script Media Uploader bawaan WordPress
    wp_enqueue_media();

    global $wpdb;
    $table_name = $wpdb->prefix . 'mma_kas';

    // 1. Proses Hapus
    if (isset($_GET['del']) && check_admin_referer('del_kas_'.$_GET['del'])) {
        $wpdb->delete($table_name, array('id' => intval($_GET['del'])));
        echo '<div class="notice notice-warning is-dismissible"><p>Data transaksi dihapus.</p></div>';
    }

    // 2. Proses Simpan (Insert Baru)
    if (isset($_POST['submit_kas']) && check_admin_referer('mma_fin_kas_action')) {
        $wpdb->insert($table_name, array(
            'tanggal' => sanitize_text_field($_POST['tanggal']),
            'jenis' => sanitize_text_field($_POST['jenis']),
            'nominal' => preg_replace('/[^0-9]/', '', $_POST['nominal']),
            'coa' => sanitize_text_field($_POST['coa']),
            'pos_anggaran' => sanitize_text_field($_POST['pos']),
            'keterangan' => sanitize_text_field($_POST['keterangan']),
            'bukti_url' => isset($_POST['bukti_url']) ? sanitize_url($_POST['bukti_url']) : ''
        ));
        echo '<div class="notice notice-success is-dismissible"><p>Transaksi Berhasil Dicatat!</p></div>';
    }

    // 3. Proses Update (Edit)
    if (isset($_POST['submit_edit_kas']) && check_admin_referer('mma_fin_kas_action')) {
        $wpdb->update(
            $table_name,
            array(
                'tanggal' => sanitize_text_field($_POST['tanggal']),
                'jenis' => sanitize_text_field($_POST['jenis']),
                'nominal' => preg_replace('/[^0-9]/', '', $_POST['nominal']),
                'coa' => sanitize_text_field($_POST['coa']),
                'pos_anggaran' => sanitize_text_field($_POST['pos']),
                'keterangan' => sanitize_text_field($_POST['keterangan']),
                'bukti_url' => isset($_POST['bukti_url']) ? sanitize_url($_POST['bukti_url']) : ''
            ),
            array('id' => intval($_POST['edit_id']))
        );
        echo '<div class="notice notice-success is-dismissible"><p>Data Transaksi Berhasil Diperbarui!</p></div>';
    }

    // 4. Tarik Data untuk Mode Edit
    $edit_mode = false;
    $edit_data = null;
    if (isset($_GET['action']) && $_GET['action'] == 'edit' && isset($_GET['id'])) {
        $edit_id = intval($_GET['id']);
        $edit_data = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $edit_id));
        if ($edit_data) {
            $edit_mode = true;
        }
    }

    $coa_arr = array_filter(array_map('trim', explode("\n", get_option('mma_coa_list'))));
    $pos_arr = array_filter(array_map('trim', explode("\n", get_option('mma_pos_list'))));

    mma_fin_css();
    ?>
    <div class="wrap fin-wrap">
        <h1 class="fin-title">📖 JURNAL BUKU KAS</h1>
        
        <form method="post" class="fin-form" style="border-color: <?php echo $edit_mode ? '#FFD700' : '#e50914'; ?>;">
            <h3 style="margin-top:0; color: <?php echo $edit_mode ? '#FFD700' : '#e50914'; ?>; font-family:'Teko'; font-size:1.8rem;">
                <?php echo $edit_mode ? '✏️ EDIT TRANSAKSI' : '+ INPUT TRANSAKSI BARU'; ?>
            </h3>
            
            <?php wp_nonce_field('mma_fin_kas_action'); ?>
            <?php if ($edit_mode) echo '<input type="hidden" name="edit_id" value="'.$edit_id.'">'; ?>
            
            <div class="fin-form-row">
                <div class="fin-form-group" style="flex: 0.5;">
                    <label>Tanggal</label>
                    <input type="date" name="tanggal" value="<?php echo $edit_mode ? esc_attr($edit_data->tanggal) : date('Y-m-d'); ?>" required>
                </div>
                <div class="fin-form-group" style="flex: 0.5;">
                    <label>Jenis Transaksi</label>
                    <select name="jenis" required>
                        <option value="masuk" <?php echo ($edit_mode && $edit_data->jenis == 'masuk') ? 'selected' : ''; ?>>Penerimaan (Masuk)</option>
                        <option value="keluar" <?php echo ($edit_mode && $edit_data->jenis == 'keluar') ? 'selected' : ''; ?>>Pengeluaran (Keluar)</option>
                    </select>
                </div>
                <div class="fin-form-group">
                    <label>Nominal (Rp)</label>
                    <input type="number" name="nominal" placeholder="Contoh: 1500000" value="<?php echo $edit_mode ? esc_attr($edit_data->nominal) : ''; ?>" required>
                </div>
            </div>

            <div class="fin-form-row">
                <div class="fin-form-group">
                    <label>Akun COA</label>
                    <select name="coa" required>
                        <option value="">-- Pilih Akun --</option>
                        <?php 
                        foreach($coa_arr as $c) {
                            $selected = ($edit_mode && $edit_data->coa == $c) ? 'selected' : '';
                            echo '<option value="'.esc_attr($c).'" '.$selected.'>'.esc_html($c).'</option>'; 
                        }
                        ?>
                    </select>
                </div>
                <div class="fin-form-group">
                    <label>Pos Anggaran</label>
                    <select name="pos" required>
                        <option value="">-- Pilih Pos --</option>
                        <?php 
                        foreach($pos_arr as $p) {
                            $selected = ($edit_mode && $edit_data->pos_anggaran == $p) ? 'selected' : '';
                            echo '<option value="'.esc_attr($p).'" '.$selected.'>'.esc_html($p).'</option>'; 
                        }
                        ?>
                    </select>
                </div>
            </div>

            <div class="fin-form-row">
                <div class="fin-form-group" style="flex:2;">
                    <label>Keterangan / Uraian</label>
                    <input type="text" name="keterangan" placeholder="Contoh: Pembayaran pendaftaran 5 atlet dari Camp X..." value="<?php echo $edit_mode ? esc_attr($edit_data->keterangan) : ''; ?>" required>
                </div>
                <div class="fin-form-group" style="flex:1;">
                    <label>📸 Foto Bukti / Nota (Opsional)</label>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <input type="text" name="bukti_url" id="bukti_url" placeholder="URL Bukti Transfer" value="<?php echo $edit_mode ? esc_attr($edit_data->bukti_url) : ''; ?>" readonly style="background:#222; cursor:not-allowed; border:1px solid #444;">
                        <button type="button" class="button" id="upload_bukti_btn" style="height:35px; background:#444; color:#fff; border:none;">UPLOAD</button>
                        <button type="button" class="button" id="remove_bukti_btn" style="height:35px; color:#fff; background:#e50914; border:none;" title="Hapus Bukti">X</button>
                    </div>
                    <div id="bukti_preview" style="margin-top:10px;">
                        <?php if ($edit_mode && !empty($edit_data->bukti_url)) : ?>
                            <img src="<?php echo esc_url($edit_data->bukti_url); ?>" style="max-height:80px; border:1px solid #555; border-radius:4px; display:block;">
                        <?php endif; ?>
                    </div>
                </div>
            </div>
            
            <?php if ($edit_mode) : ?>
                <button type="submit" name="submit_edit_kas" class="fin-btn" style="background:#FFD700; color:#000;">UPDATE TRANSAKSI</button>
                <a href="<?php echo admin_url('admin.php?page=mma-fin-kas'); ?>" class="fin-btn" style="background:#444; margin-left:10px; text-decoration:none;">BATAL</a>
            <?php else : ?>
                <button type="submit" name="submit_kas" class="fin-btn">CATAT TRANSAKSI</button>
            <?php endif; ?>
        </form>

        <div style="overflow-x:auto;">
            <table class="fin-table">
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Keterangan</th>
                        <th>Akun (COA) / Pos</th>
                        <th class="text-center">Bukti</th>
                        <th class="text-right">Debit (Masuk)</th>
                        <th class="text-right">Kredit (Keluar)</th>
                        <th class="text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $results = $wpdb->get_results("SELECT * FROM $table_name ORDER BY tanggal DESC, id DESC LIMIT 150");
                    if (empty($results)) {
                        echo '<tr><td colspan="7" style="text-align:center; color:#888;">Belum ada data transaksi.</td></tr>';
                    } else {
                        foreach ($results as $row) {
                            $is_masuk = ($row->jenis == 'masuk');
                            $edit_url = admin_url('admin.php?page=mma-fin-kas&action=edit&id='.$row->id);
                            $del_url = wp_nonce_url(admin_url('admin.php?page=mma-fin-kas&del='.$row->id), 'del_kas_'.$row->id);
                            
                            $row_style = ($edit_mode && $edit_id == $row->id) ? 'background: rgba(255,215,0,0.1);' : '';
                            
                            echo '<tr style="'.$row_style.'">';
                            echo '<td style="white-space:nowrap;">' . date('d/m/Y', strtotime($row->tanggal)) . '</td>';
                            echo '<td><strong>' . esc_html($row->keterangan) . '</strong><br><span class="badge-' . $row->jenis . '">' . strtoupper($row->jenis) . '</span></td>';
                            echo '<td><span style="color:#aaa; font-size:0.9rem;">' . esc_html($row->coa) . '<br>📌 ' . esc_html($row->pos_anggaran) . '</span></td>';
                            
                            // Tampilkan Thumbnail Bukti Jika Ada
                            echo '<td class="text-center">';
                            if (!empty($row->bukti_url)) {
                                echo '<a href="'.esc_url($row->bukti_url).'" target="_blank"><img src="'.esc_url($row->bukti_url).'" class="bukti-thumbnail" title="Klik untuk perbesar"></a>';
                            } else {
                                echo '<span style="color:#555; font-size:0.8rem;">-</span>';
                            }
                            echo '</td>';

                            echo '<td class="text-right" style="color:#00ff00;">' . ($is_masuk ? 'Rp ' . number_format($row->nominal, 0, ',', '.') : '-') . '</td>';
                            echo '<td class="text-right" style="color:#ff3333;">' . (!$is_masuk ? 'Rp ' . number_format($row->nominal, 0, ',', '.') : '-') . '</td>';
                            echo '<td class="text-right" style="white-space:nowrap;">';
                            echo '<a href="'.$edit_url.'" style="color:#FFD700; text-decoration:none; margin-right:15px; font-weight:bold;">✏️ Edit</a>';
                            echo '<a href="'.$del_url.'" style="color:#ff3333; text-decoration:none; font-weight:bold;" onclick="return confirm(\'Yakin hapus transaksi ini?\');">❌ Hapus</a>';
                            echo '</td>';
                            echo '</tr>';
                        }
                    }
                    ?>
                </tbody>
            </table>
        </div>
    </div>

    <script>
    jQuery(document).ready(function($) {
        var mediaUploader;
        
        $('#upload_bukti_btn').click(function(e) {
            e.preventDefault();
            
            if (mediaUploader) {
                mediaUploader.open();
                return;
            }
            
            mediaUploader = wp.media.frames.file_frame = wp.media({
                title: 'Pilih / Upload Bukti Transaksi (Struk/Nota)',
                button: { text: 'Gunakan Bukti Ini' },
                multiple: false
            });
            
            mediaUploader.on('select', function() {
                var attachment = mediaUploader.state().get('selection').first().toJSON();
                $('#bukti_url').val(attachment.url);
                $('#bukti_preview').html('<img src="'+attachment.url+'" style="max-height:80px; border:1px solid #555; border-radius:4px; margin-top:10px; display:block;">');
            });
            
            mediaUploader.open();
        });
        
        $('#remove_bukti_btn').click(function(e) {
            e.preventDefault();
            $('#bukti_url').val('');
            $('#bukti_preview').html('');
        });
    });
    </script>
    <?php
}

// E. HALAMAN 3: DASHBOARD & REPORTING
function mma_fin_render_dashboard() {
    if (!current_user_can('manage_keuangan')) return;
    global $wpdb;
    $table_name = $wpdb->prefix . 'mma_kas';

    // Kalkulasi Global
    $tot_masuk = $wpdb->get_var("SELECT SUM(nominal) FROM $table_name WHERE jenis = 'masuk'") ?: 0;
    $tot_keluar = $wpdb->get_var("SELECT SUM(nominal) FROM $table_name WHERE jenis = 'keluar'") ?: 0;
    $saldo = $tot_masuk - $tot_keluar;

    // Kalkulasi Per Pos Anggaran
    $pos_summary = $wpdb->get_results("
        SELECT pos_anggaran, 
               SUM(CASE WHEN jenis = 'masuk' THEN nominal ELSE 0 END) as masuk,
               SUM(CASE WHEN jenis = 'keluar' THEN nominal ELSE 0 END) as keluar
        FROM $table_name 
        GROUP BY pos_anggaran 
        ORDER BY pos_anggaran ASC
    ");

    mma_fin_css();
    ?>
    <div class="wrap fin-wrap">
        <h1 class="fin-title">📊 DASHBOARD KEUANGAN (REAL-TIME)</h1>
        
        <div class="fin-card-grid">
            <div class="fin-card" style="border-bottom: 3px solid #00ff00;">
                <h3>Total Pemasukan</h3>
                <div class="val val-in">Rp <?php echo number_format($tot_masuk, 0, ',', '.'); ?></div>
            </div>
            <div class="fin-card" style="border-bottom: 3px solid #ff3333;">
                <h3>Total Pengeluaran</h3>
                <div class="val val-out">Rp <?php echo number_format($tot_keluar, 0, ',', '.'); ?></div>
            </div>
            <div class="fin-card" style="border-bottom: 3px solid #FFD700; background: linear-gradient(145deg, #1a1a00, #000);">
                <h3 style="color:#FFD700;">SALDO KAS SAAT INI</h3>
                <div class="val val-saldo">Rp <?php echo number_format($saldo, 0, ',', '.'); ?></div>
            </div>
        </div>

        <h2 style="font-family:'Teko'; font-size: 2rem; color:#fff; margin-bottom:15px; border-left:4px solid #e50914; padding-left:10px;">LAPORAN PER POS ANGGARAN (PROYEK)</h2>
        <table class="fin-table">
            <thead>
                <tr>
                    <th>Nama Pos / Acara</th>
                    <th class="text-right">Total Pemasukan</th>
                    <th class="text-right">Total Serapan (Pengeluaran)</th>
                    <th class="text-right">Sisa Anggaran (Laba/Rugi)</th>
                </tr>
            </thead>
            <tbody>
                <?php
                if (empty($pos_summary)) {
                    echo '<tr><td colspan="4" style="text-align:center;">Belum ada data.</td></tr>';
                } else {
                    foreach ($pos_summary as $ps) {
                        $sisa = $ps->masuk - $ps->keluar;
                        $sisa_color = ($sisa < 0) ? '#ff3333' : '#00ff00';
                        echo '<tr>';
                        echo '<td><strong>' . esc_html($ps->pos_anggaran) . '</strong></td>';
                        echo '<td class="text-right" style="color:#00ff00;">Rp ' . number_format($ps->masuk, 0, ',', '.') . '</td>';
                        echo '<td class="text-right" style="color:#ff3333;">Rp ' . number_format($ps->keluar, 0, ',', '.') . '</td>';
                        echo '<td class="text-right" style="color:'.$sisa_color.'; font-weight:bold;">Rp ' . number_format($sisa, 0, ',', '.') . '</td>';
                        echo '</tr>';
                    }
                }
                ?>
            </tbody>
        </table>
    </div>
    <?php
}

// ==========================================
// 22. MODUL AGENDA (CRUD & FRONTEND)
// ==========================================

// A. Register Custom Post Type untuk Agenda
function mma_register_cpt_agenda() {
    register_post_type('mma_agenda', array(
        'labels' => array(
            'name'          => 'Agenda Kegiatan',
            'singular_name' => 'Agenda',
            'menu_name'     => '📅 Agenda',
            'add_new_item'  => 'Tambah Agenda Baru',
            'edit_item'     => 'Edit Agenda'
        ),
        'public'      => true,
        'show_ui'     => true,
        'menu_icon'   => 'dashicons-calendar-alt',
        'supports'    => array('title', 'editor'), // Judul dan Deskripsi
        'menu_position' => 6
    ));
}
add_action('init', 'mma_register_cpt_agenda');

// B. Tambah Meta Box untuk Tanggal, Waktu, Lokasi
function mma_agenda_meta_boxes() {
    add_meta_box('mma_agenda_data', 'INFO PELAKSANAAN AGENDA', 'mma_render_agenda_meta', 'mma_agenda', 'normal', 'high');
}
add_action('add_meta_boxes', 'mma_agenda_meta_boxes');

function mma_render_agenda_meta($post) {
    wp_nonce_field('save_agenda_data', 'agenda_meta_nonce');
    $tgl    = get_post_meta($post->ID, '_agenda_tanggal', true);
    $waktu  = get_post_meta($post->ID, '_agenda_waktu', true);
    $lokasi = get_post_meta($post->ID, '_agenda_lokasi', true);
    ?>
    <style>.mma-admin-box { margin-bottom: 15px; } .mma-admin-box label { font-weight: bold; color: #e50914; display: block; margin-bottom: 5px; } .mma-admin-box input { width: 100%; padding: 8px; }</style>
    <div style="display:flex; gap:20px;">
        <div class="mma-admin-box" style="flex:1;"><label>📅 Tanggal Pelaksanaan</label><input type="date" name="agenda_tanggal" value="<?php echo esc_attr($tgl); ?>" required /></div>
        <div class="mma-admin-box" style="flex:1;"><label>🕒 Waktu (Jam)</label><input type="time" name="agenda_waktu" value="<?php echo esc_attr($waktu); ?>" /></div>
    </div>
    <div class="mma-admin-box"><label>📍 Lokasi / Tempat</label><input type="text" name="agenda_lokasi" value="<?php echo esc_attr($lokasi); ?>" placeholder="Contoh: GOR Mengwi, Kabupaten MAJESTY" required /></div>
    <p style="color:#666; font-style:italic;">* Status Agenda (Selesai / Akan Datang) akan dihitung otomatis oleh sistem berdasarkan Tanggal Pelaksanaan.</p>
    <?php
}

function mma_save_agenda_meta($post_id) {
    if (!isset($_POST['agenda_meta_nonce']) || !wp_verify_nonce($_POST['agenda_meta_nonce'], 'save_agenda_data')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    
    if (isset($_POST['agenda_tanggal'])) update_post_meta($post_id, '_agenda_tanggal', sanitize_text_field($_POST['agenda_tanggal']));
    if (isset($_POST['agenda_waktu'])) update_post_meta($post_id, '_agenda_waktu', sanitize_text_field($_POST['agenda_waktu']));
    if (isset($_POST['agenda_lokasi'])) update_post_meta($post_id, '_agenda_lokasi', sanitize_text_field($_POST['agenda_lokasi']));
}
add_action('save_post_mma_agenda', 'mma_save_agenda_meta');

// C. Percantik Kolom di WP Admin
add_filter('manage_mma_agenda_posts_columns', function($columns) {
    return array(
        'cb'       => $columns['cb'],
        'title'    => 'NAMA AGENDA',
        'c_tgl'    => 'TANGGAL & WAKTU',
        'c_lokasi' => 'LOKASI',
        'c_status' => 'STATUS',
        'date'     => 'DIBUAT'
    );
});

add_action('manage_mma_agenda_posts_custom_column', function($column, $post_id) {
    $tgl   = get_post_meta($post_id, '_agenda_tanggal', true);
    $waktu = get_post_meta($post_id, '_agenda_waktu', true);
    
    if ($column == 'c_tgl') {
        echo "<strong>" . ($tgl ? date('d-m-Y', strtotime($tgl)) : '-') . "</strong><br>" . ($waktu ? $waktu . ' WITA' : '-');
    } elseif ($column == 'c_lokasi') {
        echo esc_html(get_post_meta($post_id, '_agenda_lokasi', true));
    } elseif ($column == 'c_status') {
        if (empty($tgl)) return;
        $today = date('Y-m-d');
        if ($tgl < $today) {
            echo '<span style="background:#444; color:#fff; padding:3px 8px; border-radius:3px; font-weight:bold;">✅ SELESAI</span>';
        } elseif ($tgl == $today) {
            echo '<span style="background:#FFD700; color:#000; padding:3px 8px; border-radius:3px; font-weight:bold;">🔥 HARI INI</span>';
        } else {
            echo '<span style="background:#00ff00; color:#000; padding:3px 8px; border-radius:3px; font-weight:bold;">⏳ AKAN DATANG</span>';
        }
    }
}, 10, 2);

// D. SHORTCODE UNTUK TAMPILAN FRONT-END (UI GAHAR KOMBAT STYLE)
function mma_frontend_agenda_shortcode() {
    ob_start();
    
    // Ambil tanggal hari ini di server (WITA)
    $today = current_time('Y-m-d');
    ?>
    <style>
        /* Container Utama */
        .mma-agenda-wrapper { 
            font-family: var(--font-body, 'Inter', sans-serif); 
            margin: 40px auto; 
            max-width: 1200px;
        }
        
        /* Judul Section */
        .agenda-section-title { 
            font-family: var(--font-heading, 'Teko', sans-serif); 
            font-size: 3.5rem; 
            color: #fff; 
            text-align: center; 
            margin-top: 60px; 
            margin-bottom: 40px; 
            text-transform: uppercase; 
            border-bottom: 2px solid #333; 
            padding-bottom: 15px; 
            line-height: 1.1;
        }
        .agenda-section-title span { color: var(--red-neon, #e50914); }
        .title-past { border-bottom-color: #444; color: #888; margin-top: 80px;}
        .title-past span { color: #aaa; }
        
        /* Grid Kartu */
        .agenda-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
            gap: 30px; 
        }
        
        /* Desain Kartu Utama */
        .agenda-card { 
            background: #111; 
            border: 1px solid #222; 
            border-left: 5px solid var(--red-neon, #e50914); 
            padding: 25px; 
            border-radius: 6px; 
            position: relative; 
            overflow: hidden; 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            display: flex; 
            flex-direction: column; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        }
        .agenda-card:hover { 
            transform: translateY(-10px); 
            box-shadow: 0 15px 30px rgba(229,9,20,0.2); 
            border-color: #444; 
        }
        
        /* Pita Tanggal (Date Badge) */
        .agenda-date-badge { 
            background: var(--red-neon, #e50914); 
            color: #fff; 
            display: inline-block; 
            padding: 5px 15px; 
            font-family: var(--font-heading, 'Teko', sans-serif); 
            font-size: 1.4rem; 
            letter-spacing: 1px; 
            margin-bottom: 15px; 
            border-radius: 3px; 
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        }
        
        /* Judul Agenda */
        .agenda-card-title { 
            font-family: var(--font-heading, 'Teko', sans-serif); 
            font-size: 2.2rem; 
            color: #fff; 
            margin: 0 0 15px 0; 
            line-height: 1.1; 
        }
        
        /* Informasi Waktu & Lokasi */
        .agenda-meta { 
            font-size: 0.95rem; 
            color: #aaa; 
            margin-bottom: 8px; 
            display: flex; 
            align-items: flex-start; 
            gap: 10px; 
        }
        .agenda-meta .icon { color: var(--red-neon, #e50914); font-size: 1.1rem; }
        
        /* Deskripsi Agenda */
        .agenda-desc { 
            font-size: 0.95rem; 
            color: #888; 
            margin-top: 15px; 
            padding-top: 15px; 
            border-top: 1px dashed #333; 
            flex-grow: 1; 
            line-height: 1.6;
        }
        
        /* Status Ribbon (Pojok Kanan Atas) */
        .agenda-ribbon { 
            position: absolute; 
            top: 22px; 
            right: -40px; 
            background: var(--red-neon, #e50914); 
            color: #fff; 
            font-family: var(--font-heading, 'Teko', sans-serif); 
            font-size: 1.1rem; 
            padding: 4px 45px; 
            transform: rotate(45deg); 
            font-weight: bold; 
            letter-spacing: 2px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.6); 
            text-align: center; 
        }
        
        /* VARIASI: ACARA HARI INI (GLOWING GOLD) */
        .agenda-card.today { 
            border-left-color: #FFD700; 
            border-top: 1px solid rgba(255,215,0,0.3);
            box-shadow: 0 0 20px rgba(255,215,0,0.15); 
            background: linear-gradient(145deg, #1a1a15, #0a0a0a);
        }
        .agenda-card.today:hover { box-shadow: 0 10px 30px rgba(255,215,0,0.3); }
        .agenda-card.today .agenda-date-badge { background: #FFD700; color: #000; font-weight: bold; }
        .agenda-card.today .agenda-ribbon { background: #FFD700; color: #000; animation: pulse 2s infinite; }
        .agenda-card.today .agenda-meta .icon { color: #FFD700; }
        
        /* VARIASI: ACARA SELESAI (MUTED/GRAYSCALE) */
        .agenda-card.past { 
            border-left-color: #333; 
            opacity: 0.6; 
            filter: grayscale(80%); 
        }
        .agenda-card.past:hover { 
            transform: none; /* Matikan efek melayang */
            box-shadow: none; 
            opacity: 0.9; 
            filter: grayscale(0%); 
        }
        .agenda-card.past .agenda-date-badge { background: #444; }
        .agenda-card.past .agenda-ribbon { background: #444; color: #aaa; }
        .agenda-card.past .agenda-meta .icon { color: #555; }
        
        /* Animasi Berkedip untuk Hari Ini */
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
        }

        @media (max-width: 768px) {
            .agenda-section-title { font-size: 2.5rem; }
            .agenda-card-title { font-size: 1.8rem; }
        }
    </style>
    
    <div class="mma-agenda-wrapper">
    <?php

    // Helper Fungsi untuk merender satu kartu (dipisah agar rapi)
    if (!function_exists('mma_render_agenda_card_html')) {
        function mma_render_agenda_card_html($post_id, $today) {
            $tgl = get_post_meta($post_id, '_agenda_tanggal', true);
            $waktu = get_post_meta($post_id, '_agenda_waktu', true);
            $lokasi = get_post_meta($post_id, '_agenda_lokasi', true);
            $content = wp_trim_words(get_post_field('post_content', $post_id), 20, '...'); // Potong deskripsi
            
            // Logika Penentuan Status
            if ($tgl < $today) {
                $status_class = 'past';
                $status_text  = 'SELESAI';
            } elseif ($tgl == $today) {
                $status_class = 'today';
                $status_text  = 'HARI INI';
            } else {
                $status_class = 'upcoming';
                $status_text  = 'SEGERA';
            }

            // Format Tanggal ala Indonesia (Misal: 15 Mei 2026)
            $months = array(1=>'Jan',2=>'Feb',3=>'Mar',4=>'Apr',5=>'Mei',6=>'Jun',7=>'Jul',8=>'Ags',9=>'Sep',10=>'Okt',11=>'Nov',12=>'Des');
            $date_display = '-';
            if ($tgl) {
                $m = (int)date('m', strtotime($tgl));
                $date_display = date('d', strtotime($tgl)) . ' ' . $months[$m] . ' ' . date('Y', strtotime($tgl));
            }
            
            // Output HTML Kartu
            echo '<div class="agenda-card ' . $status_class . '">';
            echo '<div class="agenda-ribbon">' . $status_text . '</div>';
            echo '<div><span class="agenda-date-badge">📅 ' . $date_display . '</span></div>';
            echo '<h3 class="agenda-card-title">' . get_the_title($post_id) . '</h3>';
            
            echo '<div class="agenda-meta">';
            echo '<span class="icon">🕒</span> ';
            echo '<span>' . ($waktu ? esc_html($waktu) . ' WITA' : 'Waktu TBA') . '</span>';
            echo '</div>';
            
            echo '<div class="agenda-meta">';
            echo '<span class="icon">📍</span> ';
            echo '<span>' . ($lokasi ? esc_html($lokasi) : 'Lokasi Menyusul') . '</span>';
            echo '</div>';
            
            if ($content) {
                echo '<div class="agenda-desc">' . esc_html($content) . '</div>';
            }
            
            echo '</div>';
        }
    }

    // ---------------------------------------------------------
    // 1. QUERY: AGENDA MENDATANG (Termasuk Hari Ini)
    // ---------------------------------------------------------
    $args_upcoming = array(
        'post_type'      => 'mma_agenda',
        'posts_per_page' => -1,
        'meta_key'       => '_agenda_tanggal',
        'orderby'        => 'meta_value',
        'order'          => 'ASC', // Urutkan dari yang terdekat
        'meta_query'     => array(
            array(
                'key'     => '_agenda_tanggal',
                'value'   => $today,
                'compare' => '>=', // Lebih besar atau sama dengan hari ini
                'type'    => 'DATE'
            )
        )
    );
    $query_upcoming = new WP_Query($args_upcoming);

    echo '<h2 class="agenda-section-title">AGENDA <span>MENDATANG</span></h2>';
    
    if ($query_upcoming->have_posts()) {
        echo '<div class="agenda-grid">';
        while ($query_upcoming->have_posts()) { 
            $query_upcoming->the_post(); 
            mma_render_agenda_card_html(get_the_ID(), $today); 
        }
        echo '</div>';
    } else { 
        echo '<p style="color:#888; font-style:italic; text-align:center; font-size:1.2rem;">Belum ada agenda terdekat yang dijadwalkan.</p>'; 
    }
    wp_reset_postdata();

    // ---------------------------------------------------------
    // 2. QUERY: AGENDA SELESAI (Masa Lalu)
    // ---------------------------------------------------------
    $args_past = array(
        'post_type'      => 'mma_agenda',
        'posts_per_page' => 6, // Tampilkan 6 yang terakhir saja agar tidak menumpuk
        'meta_key'       => '_agenda_tanggal',
        'orderby'        => 'meta_value',
        'order'          => 'DESC', // Urutkan dari yang paling baru selesai
        'meta_query'     => array(
            array(
                'key'     => '_agenda_tanggal',
                'value'   => $today,
                'compare' => '<', // Kurang dari hari ini
                'type'    => 'DATE'
            )
        )
    );
    $query_past = new WP_Query($args_past);

    if ($query_past->have_posts()) {
        echo '<h2 class="agenda-section-title title-past">AGENDA <span>TELAH SELESAI</span></h2>';
        echo '<div class="agenda-grid">';
        while ($query_past->have_posts()) { 
            $query_past->the_post(); 
            mma_render_agenda_card_html(get_the_ID(), $today); 
        }
        echo '</div>';
    }
    wp_reset_postdata();

    echo '</div>'; // End wrapper
    return ob_get_clean();
}
add_shortcode('mma_agenda', 'mma_frontend_agenda_shortcode');

// ==========================================
// 23. MANAJEMEN HAK AKSES (USER ROLES & CAPABILITIES)
// ==========================================
function mma_custom_roles_caps() {
    // 1. Buat Jabatan: Bendahara
    // Hanya bisa melihat dashboard dasar dan mengelola modul Keuangan
    add_role('bendahara', 'Bendahara (Keuangan)', array(
        'read' => true,
        'manage_keuangan' => true // Kunci khusus untuk menu Keuangan
    ));

    // 2. Buat Jabatan: Sekretariat
    // Bisa menulis berita, upload gambar, kelola Daftar Atlet, Agenda, dan Bagan
    add_role('sekretaris', 'Sekretariat (Atlet & Agenda)', array(
        'read' => true,
        'edit_posts' => true,
        'edit_published_posts' => true,
        'upload_files' => true,
        'manage_administrasi' => true // Kunci khusus untuk menu Drawing & Atlet
    ));

    // 3. Pastikan Administrator Utama tetap memegang semua kunci
    $admin = get_role('administrator');
    if ($admin) {
        $admin->add_cap('manage_keuangan');
        $admin->add_cap('manage_administrasi');
    }
}
add_action('init', 'mma_custom_roles_caps');

// ==========================================
// 24. SHORTCODE FORMULIR PENDAFTARAN ATLET FE
// ==========================================
add_shortcode('mma_form_pendaftaran', 'mma_render_form_pendaftaran');
function mma_render_form_pendaftaran() {
    ob_start();
    ?>
    <style>
        .kombat-form-wrap { background: #111; padding: 30px; border: 1px solid #333; border-top: 4px solid #e50914; border-radius: 5px; margin: 40px 0;}
        .fin-form-row { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px; }
        .fin-form-group { flex: 1; min-width: 250px; }
        .fin-form-group label { display: block; font-family: 'Teko', sans-serif; font-size: 1.5rem; color: #aaa; margin-bottom: 8px; letter-spacing: 1px;}
        .fin-form-group input, .fin-form-group select { width: 100%; padding: 15px; background: #0a0a0a; border: 1px solid #333; color: #fff; font-family: 'Inter', sans-serif; font-size: 1rem; }
        .fin-form-group input:focus, .fin-form-group select:focus { border-color: #e50914; outline: none; }
        .btn-submit-kombat { background: #e50914; color: #fff; border: none; padding: 15px 30px; width: 100%; font-family: 'Teko', sans-serif; font-size: 2rem; letter-spacing: 2px; cursor: pointer; transition: 0.3s; text-transform: uppercase;}
        .btn-submit-kombat:hover { background: #FFD700; color: #000; box-shadow: 0 0 20px rgba(255,215,0,0.4); }
    </style>

    <div class="kombat-form-wrap">
        
        <?php 
        // BLOK NOTIFIKASI
        if (isset($_GET['status'])) : 
            if ($_GET['status'] == 'success') :
        ?>
            <div style="background: rgba(0,255,0,0.1); border: 2px solid #00ff00; color: #00ff00; padding: 20px; margin-bottom: 30px; text-align: center; font-size: 1.2rem; font-weight: bold; border-radius: 5px;">
                ✅ PENDAFTARAN BERHASIL TERKIRIM! DATA ATLET SUDAH MASUK KE SISTEM.
            </div>
        <?php elseif ($_GET['status'] == 'exists') : ?>
            <div style="background: rgba(255,0,0,0.1); border: 2px solid #ff3333; color: #ff3333; padding: 20px; margin-bottom: 30px; text-align: center; font-size: 1.2rem; font-weight: bold; border-radius: 5px;">
                ⚠️ MAAF, ANDA SUDAH TERDAFTAR!<br>
                <span style="font-size:1rem; font-weight:normal; color:#ccc;">Atlet dengan Nama dan Tanggal Lahir tersebut sudah ada di sistem kami.</span>
            </div>
        <?php elseif ($_GET['status'] == 'invalid_age') : ?>
            <div style="background: rgba(255,165,0,0.1); border: 2px solid #ffa500; color: #ffa500; padding: 20px; margin-bottom: 30px; text-align: center; font-size: 1.2rem; font-weight: bold; border-radius: 5px;">
                ⚠️ PENDAFTARAN DITOLAK: UMUR TIDAK SESUAI!<br>
                <span style="font-size:1rem; font-weight:normal; color:#ccc;">Sesuai regulasi (Cut-Off 30 April 2026), usia atlet yang diizinkan bertanding adalah <strong>7 hingga 35 Tahun</strong>. Periksa kembali input tanggal lahir Anda.</span>
            </div>
        <?php 
            endif;
        endif; 
        ?>

        <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="POST">
            
            <input type="hidden" name="action" value="submit_atlet">
            <?php wp_nonce_field('submit_atlet_action', 'atlet_nonce_field'); ?>
            <input type="text" name="mma_bot_trap" value="" style="display:none;">

            <div class="fin-form-row">
                <div class="fin-form-group">
                    <label>NAMA LENGKAP ATLET</label>
                    <input type="text" name="atlet_name" required placeholder="Sesuai Akta / KTP">
                </div>
                <div class="fin-form-group">
                    <label>ASAL SASANA / TIM</label>
                    <input type="text" name="asal_tim" required placeholder="Contoh: Majesty Training Camp">
                </div>
            </div>
            
            <div class="fin-form-row">
                <div class="fin-form-group">
                    <label>NOMOR WHATSAPP (AKTIF)</label>
                    <input type="text" name="no_wa" required placeholder="Contoh: 087838872777">
                </div>
                <div class="fin-form-group">
                    <label>TANGGAL LAHIR</label>
                    <input type="date" name="tanggal_lahir" required min="1990-05-01" max="2019-04-30">
                    <small style="color:#e50914; font-size:0.85rem; margin-top:5px; display:block;">*Syarat: Berusia 7 - 35 Tahun pada April 2026</small>
                </div>
            </div>

            <div class="fin-form-row">
                <div class="fin-form-group">
                    <label>JENIS KELAMIN</label>
                    <select name="jenis_kelamin" required>
                        <option value="">-- Pilih --</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                </div>
                <div class="fin-form-group">
                    <label>KATEGORI TANDING</label>
                    <select name="kategori_tanding" required>
                        <option value="">-- Pilih --</option>
                        <option value="Assaut">Assaut</option>
                        <option value="Combat">Combat</option>
                    </select>
                </div>
                <div class="fin-form-group">
                    <label>BERAT BADAN (KG)</label>
                    <input type="number" step="0.1" name="berat_badan" required placeholder="Contoh: 65.5">
                </div>
            </div>

            <button type="submit" class="btn-submit-kombat">KIRIM DATA PENDAFTARAN</button>
        </form>
    </div>
    <?php
    return ob_get_clean();
}

// ==========================================
// 25. CSS KHUSUS HALAMAN KEJUARAAN (PODIUM & FLEXBOX)
// ==========================================
add_action('wp_head', 'mma_custom_kejuaraan_css', 100);
function mma_custom_kejuaraan_css() {
    if (is_page()) {
        echo '<style>
        /* CSS Responsif Khusus Konten Kejuaraan */
        .kombat-flex-container { display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 30px; }
        .kombat-flex-box { flex: 1; min-width: 200px; background: #0a0a0a; border: 1px solid #333; border-top: 3px solid #e50914; padding: 20px; text-align: center; }
        .kombat-podium-container { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; text-align: center; }
        .podium-box { flex: 1; min-width: 250px; padding: 30px 20px; background: #0a0a0a; }
        .podium-2 { border: 1px solid #C0C0C0; border-top: 5px solid #C0C0C0; order: 1; }
        .podium-1 { border: 2px solid #FFD700; border-top: 8px solid #FFD700; background: #111; padding: 40px 20px; z-index: 2; order: 2; box-shadow: 0 0 20px rgba(255,215,0,0.15);}
        .podium-3 { border: 1px solid #CD7F32; border-top: 5px solid #CD7F32; order: 3; }

        /* Trik Podium HP: Juara 1 Naik Paling Atas */
        @media (max-width: 768px) {
            .kombat-podium-container { flex-direction: column; }
            .podium-1 { order: -1 !important; }
        }
        </style>';
    }
}

// ==========================================
// 26. MODUL TICKETING & SPECTATOR (KOMBAT TICKET PRO - DYNAMIC)
// ==========================================

// A. Daftarkan Custom Post Type "Tiket"
function mma_register_cpt_tiket() {
    register_post_type('mma_tiket', array(
        'labels' => array(
            'name'          => 'Data Pembeli Tiket',
            'singular_name' => 'Tiket',
            'menu_name'     => '🎟️ Tiket Event',
            'add_new_item'  => 'Tambah Pembeli Manual',
            'edit_item'     => 'Detail Pembelian'
        ),
        'public'      => false,
        'show_ui'     => true,
        'menu_icon'   => 'dashicons-tickets-alt',
        'supports'    => array('title'), // Title = Nama Pembeli
        'menu_position' => 6
    ));
}
add_action('init', 'mma_register_cpt_tiket');

// Ubah Label Title menjadi Nama Pembeli
add_filter('enter_title_here', function($title) {
    $screen = get_current_screen();
    if ('mma_tiket' == $screen->post_type) { $title = 'NAMA LENGKAP PEMBELI'; }
    return $title;
});

// B. Buat Menu Sub-Halaman untuk Pengaturan Event & Harga
function mma_tiket_settings_menu() {
    add_submenu_page('edit.php?post_type=mma_tiket', 'Pengaturan Tiket', '⚙️ Pengaturan Event', 'manage_options', 'mma-tiket-settings', 'mma_render_tiket_settings');
}
add_action('admin_menu', 'mma_tiket_settings_menu');

// Tampilan Halaman Pengaturan Event Tiket (Dynamic Repeater)
function mma_render_tiket_settings() {
    if (!current_user_can('manage_options')) return;

    if (isset($_POST['submit_tiket_settings']) && check_admin_referer('save_tiket_settings_action')) {
        $names = $_POST['event_name'];
        $prices = $_POST['event_price'];
        $events = array();
        
        for ($i = 0; $i < count($names); $i++) {
            if (!empty(trim($names[$i]))) {
                $events[] = array(
                    'name' => sanitize_text_field($names[$i]),
                    'price' => intval($prices[$i])
                );
            }
        }
        update_option('mma_ticket_events', $events);
        echo '<div class="notice notice-success is-dismissible"><p>✅ Daftar Event & Harga berhasil diperbarui!</p></div>';
    }

    $saved_events = get_option('mma_ticket_events', array(
        array('name' => 'Tiket Nonton Kejuaraan', 'price' => 10000),
        array('name' => 'Tiket Coaching Clinic', 'price' => 50000)
    ));
    ?>
    <div class="wrap" style="background:#0a0a0a; color:#fff; padding:20px; border-top:4px solid #FFD700;">
        <h1 style="font-family:'Teko', sans-serif; font-size:2.5rem; color:#FFD700; margin-top:0;">⚙️ MANAJEMEN EVENT & TIKET</h1>
        <p style="color:#aaa;">Tambahkan atau hapus daftar event yang tersedia. Form di halaman web akan otomatis menyesuaikan daftar ini.</p>
        
        <form method="post" style="background:#111; padding:20px; border:1px solid #333; max-width:700px;">
            <?php wp_nonce_field('save_tiket_settings_action'); ?>
            
            <div id="event-repeater-container">
                <?php foreach ($saved_events as $ev) : ?>
                <div class="event-row" style="display:flex; gap:10px; margin-bottom:15px; align-items:flex-end;">
                    <div style="flex:2;">
                        <label style="display:block; font-weight:bold; color:#e50914; margin-bottom:5px;">Nama Event / Kategori Tiket</label>
                        <input type="text" name="event_name[]" value="<?php echo esc_attr($ev['name']); ?>" style="width:100%; padding:8px; background:#000; color:#fff; border:1px solid #444;" required>
                    </div>
                    <div style="flex:1;">
                        <label style="display:block; font-weight:bold; color:#e50914; margin-bottom:5px;">Harga (Rp)</label>
                        <input type="number" name="event_price[]" value="<?php echo esc_attr($ev['price']); ?>" style="width:100%; padding:8px; background:#000; color:#fff; border:1px solid #444;" required>
                    </div>
                    <button type="button" class="button remove-row" style="height:35px; color:#fff; background:#e50914; border:none;">X</button>
                </div>
                <?php endforeach; ?>
            </div>
            
            <button type="button" id="add-event-btn" class="button" style="background:#444; color:#fff; border:none; margin-bottom:20px;">+ Tambah Event Baru</button>
            <br>
            <button type="submit" name="submit_tiket_settings" class="button button-primary" style="background:#e50914; border:none; font-size:1.1rem; padding:5px 20px; height:auto;">💾 SIMPAN PERUBAHAN</button>
        </form>
    </div>

    <script>
    jQuery(document).ready(function($) {
        $('#add-event-btn').on('click', function() {
            var row = '<div class="event-row" style="display:flex; gap:10px; margin-bottom:15px; align-items:flex-end;">' +
                '<div style="flex:2;"><input type="text" name="event_name[]" placeholder="Contoh: Tiket VIP" style="width:100%; padding:8px; background:#000; color:#fff; border:1px solid #444;" required></div>' +
                '<div style="flex:1;"><input type="number" name="event_price[]" placeholder="Contoh: 150000" style="width:100%; padding:8px; background:#000; color:#fff; border:1px solid #444;" required></div>' +
                '<button type="button" class="button remove-row" style="height:35px; color:#fff; background:#e50914; border:none;">X</button>' +
                '</div>';
            $('#event-repeater-container').append(row);
        });

        $(document).on('click', '.remove-row', function() {
            $(this).closest('.event-row').remove();
        });
    });
    </script>
    <?php
}

// --- TAMBAH META BOX EDIT STATUS PEMBAYARAN TIKET ---
add_action('add_meta_boxes', function() {
    add_meta_box('mma_tiket_data', 'DETAIL PEMBAYARAN TIKET', 'mma_render_tiket_meta', 'mma_tiket', 'normal', 'high');
});

function mma_render_tiket_meta($post) {
    wp_nonce_field('save_tiket_pay_status', 'tiket_pay_nonce');
    $pay_status = get_post_meta($post->ID, '_pay_status', true) ?: 'unpaid';
    $wa = get_post_meta($post->ID, '_tiket_wa', true);
    $total = get_post_meta($post->ID, '_tiket_total', true);
    
    echo '<div style="padding:10px;">';
    echo '<p><strong>Total Tagihan:</strong> <span style="color:#00aa00; font-size:1.4rem; font-weight:bold;">Rp '.number_format((float)$total,0,',','.').'</span></p>';
    echo '<p><strong>WhatsApp Pembeli:</strong> '.$wa.'</p>';
    echo '<hr>';
    echo '<label style="display:block; font-weight:bold; margin-bottom:10px;">STATUS PEMBAYARAN TIKET:</label>';
    echo '<select name="pay_status" style="width:100%; padding:10px; font-weight:bold; border:2px solid #FFD700;">';
    echo '<option value="unpaid" '.selected($pay_status, 'unpaid', false).'>❌ MENUNGGU PEMBAYARAN (PENDING)</option>';
    echo '<option value="paid" '.selected($pay_status, 'paid', false).'>✅ PEMBAYARAN DITERIMA (LUNAS)</option>';
    echo '</select>';
    echo '</div>';
}

// Simpan Status Pembayaran Tiket ke Database
add_action('save_post_mma_tiket', function($post_id) {
    if (!isset($_POST['tiket_pay_nonce']) || !wp_verify_nonce($_POST['tiket_pay_nonce'], 'save_tiket_pay_status')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (isset($_POST['pay_status'])) {
        update_post_meta($post_id, '_pay_status', sanitize_text_field($_POST['pay_status']));
    }
});

// C. Custom Columns untuk Tabel Pembeli Tiket di Admin
add_filter('manage_mma_tiket_posts_columns', function($columns) {
    return [
        'cb'          => $columns['cb'],
        'title'       => 'NAMA PEMBELI',
        'c_pay'       => 'STATUS', // <--- KOLOM STATUS PEMBAYARAN BARU
        'c_kategori'  => 'EVENT / TIKET',
        'c_tgl_lahir' => 'TANGGAL LAHIR',
        'c_domisili'  => 'DOMISILI',
        'c_wa'        => 'WHATSAPP',
        'c_jumlah'    => 'JML TIKET',
        'c_harga'     => 'HARGA SATUAN',
        'c_total'     => 'TOTAL DIBAYAR',
        'c_aksi'      => 'AKSI (CETAK)', 
        'date'        => 'WAKTU ORDER'
    ];
});

add_action('manage_mma_tiket_posts_custom_column', function($column, $post_id) {
    switch ($column) {
        case 'c_pay': // TAMPILAN BADGE PEMBAYARAN
            $status = get_post_meta($post_id, '_pay_status', true) ?: 'unpaid';
            if ($status == 'paid') {
                echo '<span style="background:#00ff00; color:#000; padding:4px 8px; border-radius:3px; font-weight:bold; font-size:10px;">✅ LUNAS</span>';
            } else {
                echo '<span style="background:#ff9900; color:#000; padding:4px 8px; border-radius:3px; font-weight:bold; font-size:10px;">⏳ PENDING</span>';
            }
            break;
        case 'c_kategori':
            $kat = get_post_meta($post_id, '_tiket_kategori', true);
            echo '<span style="background:#e50914; color:#fff; padding:3px 8px; border-radius:3px; font-weight:bold; font-size:10px;">'.esc_html(strtoupper($kat)).'</span>';
            break;
        case 'c_tgl_lahir':
            $tgl = get_post_meta($post_id, '_tiket_tgl_lahir', true);
            echo $tgl ? date('d M Y', strtotime($tgl)) : '-';
            break;
        case 'c_domisili':
            echo esc_html(get_post_meta($post_id, '_tiket_domisili', true));
            break;
        case 'c_wa':
            $wa = esc_html(get_post_meta($post_id, '_tiket_wa', true));
            echo !empty($wa) ? "<a href='https://wa.me/".preg_replace('/[^0-9]/','',$wa)."' target='_blank'>$wa</a>" : '-';
            break;
        case 'c_jumlah':
            echo '<strong style="font-size:1.2rem;">' . esc_html(get_post_meta($post_id, '_tiket_jumlah', true)) . '</strong>';
            break;
        case 'c_harga':
            echo 'Rp ' . number_format((int)get_post_meta($post_id, '_tiket_harga', true), 0, ',', '.');
            break;
        case 'c_total':
            echo '<strong style="color:#00ff00; font-size:1.1rem;">Rp ' . number_format((int)get_post_meta($post_id, '_tiket_total', true), 0, ',', '.') . '</strong>';
            break;
        case 'c_aksi':
            // Ambil data untuk dilempar ke Javascript PDF
            $nama_pembeli = esc_attr(get_the_title($post_id));
            $tgl_order    = get_the_date('dmy', $post_id); 
            $qty          = (int)get_post_meta($post_id, '_tiket_jumlah', true);
            $event_kat    = esc_attr(get_post_meta($post_id, '_tiket_kategori', true));
            
            // Render Tombol
            echo '<button type="button" class="button button-primary btn-cetak-tiket" data-nama="'.$nama_pembeli.'" data-tgl="'.$tgl_order.'" data-qty="'.$qty.'" data-event="'.$event_kat.'" style="background:#e50914; border-color:#cc0000; font-weight:bold;">🖨️ Cetak PDF</button>';
            break;
    }
}, 10, 2);

// D. Shortcode Form Pemesanan Tiket Frontend [mma_form_tiket]
add_shortcode('mma_form_tiket', 'mma_render_form_tiket');
function mma_render_form_tiket() {
    ob_start();
    // Ambil data event dari database
    $saved_events = get_option('mma_ticket_events', array());
    if (empty($saved_events)) { $saved_events = array(array('name' => 'Loading Data...', 'price' => 0)); }
    ?>
    <style>
        .kombat-form-wrap { background: #111; padding: 30px; border: 1px solid #333; border-top: 4px solid #FFD700; border-radius: 5px; margin: 40px 0; font-family: 'Inter', sans-serif;}
        .fin-form-row { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px; }
        .fin-form-group { flex: 1; min-width: 250px; }
        .fin-form-group label { display: block; font-family: 'Teko', sans-serif; font-size: 1.5rem; color: #FFD700; margin-bottom: 8px; letter-spacing: 1px;}
        .fin-form-group input, .fin-form-group select { width: 100%; padding: 15px; background: #0a0a0a; border: 1px solid #333; color: #fff; font-size: 1rem; box-sizing: border-box; }
        .fin-form-group input:focus, .fin-form-group select:focus { border-color: #FFD700; outline: none; }
        
        .total-box { background: #000; border: 2px dashed #FFD700; padding: 20px; text-align: center; margin-bottom: 20px; }
        .total-box span { display: block; color: #aaa; font-size: 1rem; text-transform: uppercase; margin-bottom: 5px;}
        .total-box strong { font-family: 'Teko', sans-serif; font-size: 3.5rem; color: #00ff00; line-height: 1; }
        
        .btn-submit-tiket { background: #FFD700; color: #000; border: none; padding: 15px 30px; width: 100%; font-family: 'Teko', sans-serif; font-size: 2rem; letter-spacing: 2px; cursor: pointer; transition: 0.3s; text-transform: uppercase; font-weight: bold;}
        .btn-submit-tiket:hover { background: #fff; box-shadow: 0 0 20px rgba(255,215,0,0.4); }
    </style>

    <div class="kombat-form-wrap">
        
        <?php if (isset($_GET['status']) && $_GET['status'] == 'success_tiket') : ?>
            <div style="background: rgba(0,255,0,0.1); border: 2px solid #00ff00; color: #00ff00; padding: 20px; margin-bottom: 30px; text-align: center; font-size: 1.2rem; font-weight: bold; border-radius: 5px;">
                ✅ PEMESANAN BERHASIL DICATAT!<br>
                <span style="font-size:1rem; font-weight:normal; color:#ccc;">Silakan selesaikan pembayaran sesuai panduan yang diberikan oleh panitia ke WhatsApp Anda.</span>
            </div>
        <?php endif; ?>

        <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="POST">
            <input type="hidden" name="action" value="submit_order_tiket">
            <?php wp_nonce_field('submit_tiket_action', 'tiket_nonce_field'); ?>

            <div class="fin-form-row">
                <div class="fin-form-group">
                    <label>PILIH EVENT / KATEGORI TIKET</label>
                    <select name="kategori_event" id="kategori_event" required>
                        <option value="" data-harga="0">-- Pilih Event --</option>
                        <?php foreach ($saved_events as $ev) : ?>
                            <option value="<?php echo esc_attr($ev['name']); ?>" data-harga="<?php echo esc_attr($ev['price']); ?>">
                                <?php echo esc_html($ev['name']); ?> (Rp <?php echo number_format($ev['price'],0,',','.'); ?>)
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="fin-form-group">
                    <label>JUMLAH TIKET</label>
                    <input type="number" name="jumlah_tiket" id="jumlah_tiket" min="1" max="50" value="1" required>
                </div>
            </div>

            <div class="fin-form-row">
                <div class="fin-form-group">
                    <label>NAMA LENGKAP PEMBELI</label>
                    <input type="text" name="nama_pembeli" required placeholder="Sesuai KTP / Identitas">
                </div>
                <div class="fin-form-group">
                    <label>TANGGAL LAHIR</label>
                    <input type="date" name="tgl_lahir" required>
                </div>
            </div>
            
            <div class="fin-form-row">
                <div class="fin-form-group">
                    <label>DOMISILI (KOTA / KABUPATEN)</label>
                    <input type="text" name="domisili" required placeholder="Contoh: Denpasar Selatan">
                </div>
                <div class="fin-form-group">
                    <label>NOMOR WHATSAPP</label>
                    <input type="text" name="no_wa" required placeholder="Untuk pengiriman e-ticket">
                </div>
            </div>

            <div class="total-box">
                <span>TOTAL YANG HARUS DIBAYAR</span>
                <strong id="display_total">Rp 0</strong>
            </div>

            <button type="submit" class="btn-submit-tiket">PESAN TIKET SEKARANG</button>
        </form>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        var eventSelect = document.getElementById('kategori_event');
        var qtyInput = document.getElementById('jumlah_tiket');
        var displayTotal = document.getElementById('display_total');

        function hitungTotal() {
            var harga = 0;
            if(eventSelect.selectedIndex > 0) {
                harga = parseInt(eventSelect.options[eventSelect.selectedIndex].getAttribute('data-harga'));
            }
            var jumlah = parseInt(qtyInput.value) || 1;
            var total = harga * jumlah;
            
            displayTotal.innerHTML = 'Rp ' + total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }

        eventSelect.addEventListener('change', hitungTotal);
        qtyInput.addEventListener('input', hitungTotal);
    });
    </script>
    <?php
    return ob_get_clean();
}

// E. Handler Backend Penyimpanan Form Pemesanan Tiket
function mma_terima_order_tiket() {
    $redirect_url = isset($_POST['_wp_http_referer']) ? esc_url_raw($_POST['_wp_http_referer']) : home_url();

    if ( ! isset( $_POST['tiket_nonce_field'] ) || ! wp_verify_nonce( $_POST['tiket_nonce_field'], 'submit_tiket_action' ) ) {
        wp_die('Akses ditolak! Token keamanan tidak valid.');
    }

    if (isset($_POST['nama_pembeli']) && isset($_POST['kategori_event'])) {
        
        $nama     = sanitize_text_field($_POST['nama_pembeli']);
        $kat      = sanitize_text_field($_POST['kategori_event']); 
        $jumlah   = intval($_POST['jumlah_tiket']);
        $tgl      = sanitize_text_field($_POST['tgl_lahir']);
        $domisili = sanitize_text_field($_POST['domisili']);
        $wa       = sanitize_text_field($_POST['no_wa']);

        $saved_events = get_option('mma_ticket_events', array());
        $harga_satuan = 0;
        foreach ($saved_events as $ev) {
            if ($ev['name'] === $kat) {
                $harga_satuan = intval($ev['price']);
                break;
            }
        }

        $total_bayar = $harga_satuan * $jumlah;

        // Simpan Data ke Database
        $post_id = wp_insert_post(array(
            'post_title'  => $nama,
            'post_type'   => 'mma_tiket',
            'post_status' => 'publish' 
        ));

        if ($post_id && !is_wp_error($post_id)) {
            update_post_meta($post_id, '_tiket_kategori', $kat);
            update_post_meta($post_id, '_tiket_tgl_lahir', $tgl);
            update_post_meta($post_id, '_tiket_domisili', $domisili);
            update_post_meta($post_id, '_tiket_jumlah', $jumlah);
            update_post_meta($post_id, '_tiket_wa', $wa);
            update_post_meta($post_id, '_tiket_harga', $harga_satuan);
            update_post_meta($post_id, '_tiket_total', $total_bayar);
            
            // ----------------------------------------------------
            // FORMAT PESAN OTOMATIS KE WHATSAPP ADMIN
            // ----------------------------------------------------
            $admin_wa = '6283898227772'; // Nomor WA Admin
            $pesan_wa = "Halo Admin MAJESTY BALI, saya ingin mengonfirmasi pemesanan tiket dengan detail berikut:\n\n";
            $pesan_wa .= "👤 *Nama:* " . $nama . "\n";
            $pesan_wa .= "🎟️ *Event:* " . $kat . "\n";
            $pesan_wa .= "🔢 *Jumlah:* " . $jumlah . " Tiket\n";
            $pesan_wa .= "💰 *Total Bayar:* Rp " . number_format($total_bayar, 0, ',', '.') . "\n";
            $pesan_wa .= "📍 *Domisili:* " . $domisili . "\n";
            $pesan_wa .= "📱 *No. WA:* " . $wa . "\n\n";
            $pesan_wa .= "Mohon informasi untuk instruksi pembayarannya. Terima kasih!";
            
            // Ubah link redirect menjadi link API WhatsApp
            $redirect_url = "https://api.whatsapp.com/send?phone=" . $admin_wa . "&text=" . urlencode($pesan_wa);
        }
    }

    // Melompat ke WhatsApp (Gunakan wp_redirect karena URL mengarah keluar website)
    if (!headers_sent()) {
        wp_redirect($redirect_url);
        exit;
    } else {
        echo '<script>window.location.href="'.esc_url_raw($redirect_url).'";</script>';
        exit;
    }
}
add_action('admin_post_nopriv_submit_order_tiket', 'mma_terima_order_tiket');
add_action('admin_post_submit_order_tiket', 'mma_terima_order_tiket');

// F. ENGINE GENERATOR PDF TIKET (HTML2PDF)
add_action('admin_footer', 'mma_tiket_pdf_generator_script');
function mma_tiket_pdf_generator_script() {
    global $pagenow, $typenow;
    // Hanya load library dan script ini di halaman tabel Data Pembeli Tiket
    if ($pagenow == 'edit.php' && $typenow == 'mma_tiket') {
        echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>';
        ?>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            
            // 1. Buat kontainer rahasia untuk merakit HTML sebelum diubah jadi PDF
            var pdfContainer = document.createElement('div');
            pdfContainer.id = 'kombat-pdf-ticket-container';
            pdfContainer.style.display = 'none';
            document.body.appendChild(pdfContainer);

            var buttons = document.querySelectorAll('.btn-cetak-tiket');
            
            buttons.forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    var oldText = this.innerText;
                    this.innerText = '⏳ Memproses...';
                    var _btn = this;
                    
                    // 2. Tarik Data Atribut
                    var rawNama = this.getAttribute('data-nama');
                    var tgl = this.getAttribute('data-tgl');
                    var qty = parseInt(this.getAttribute('data-qty'));
                    var eventName = this.getAttribute('data-event');

                    // 3. Format Penamaan File (namalengkap_namaevent_tanggalorder_qty.pdf)
                    var safeNama = rawNama.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
                    var safeEvent = eventName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''); // Pembersih nama event
                    var filename = safeNama + '_' + safeEvent + '_' + tgl + '_' + qty + '.pdf';

                    // GAMBAR DESAIN GELANG
                    var imageGelangUrl = 'https://mmamajestybali.com/wp-content/uploads/2026/04/mma-majesty-battle.png?q=80&w=800&auto=format&fit=crop'; 

                    // 4. Rakit HTML PDF (Layout Landscape Panjang)
                    var html = '<div style="padding:30px; font-family:Arial, sans-serif; background:#fff; color:#000;">';
                    
                    // Header PDF
                    html += '<div style="display:flex; justify-content:space-between; border-bottom:3px solid #000; padding-bottom:10px; margin-bottom:20px;">';
                    html += '<h1 style="margin:0; color:#e50914; font-weight:900; font-size:24px;">E-TICKET: MAJESTY BALI 2026</h1>';
                    html += '<div style="text-align:right; font-size:14px;"><strong>Pembeli:</strong> ' + rawNama + ' | <strong>Total:</strong> ' + qty + ' Tiket</div>';
                    html += '</div>';

                    // 5. Looping Desain Gelang Memanjang
                    for(var i=1; i<=qty; i++) {
                        var randCode = Math.floor(Math.random() * 90000) + 10000; 
                        
                        html += '<div style="border:2px dashed #000; margin-bottom:20px; border-radius:10px; display:flex; align-items:stretch; page-break-inside: avoid; overflow:hidden; height:150px; width:100%;">';
                        
                        // Kolom Kiri: Gambar (Logo/Desain Gelang)
                        html += '<div style="flex: 0 0 250px; background:url(' + imageGelangUrl + ') center/cover;">';
                        html += '</div>';
                        
                        // Kolom Tengah: Info Utama (Background Hitam)
                        html += '<div style="flex:1; padding:20px; background:#111; color:#fff; display:flex; flex-direction:column; justify-content:center; border-right:3px dashed #fff;">';
                        html += '<h2 style="margin:0 0 5px 0; font-size:28px; color:#FFD700; letter-spacing:1px; text-transform:uppercase;">MAJESTY BALI 2026</h2>';
                        html += '<p style="margin:0; font-size:18px; color:#ccc; text-transform:uppercase;">KATEGORI: <strong>' + eventName + '</strong></p>';
                        html += '<p style="margin:15px 0 0 0; font-size:14px; color:#888;">PEMILIK TIKET: <span style="color:#fff; font-weight:bold;">' + rawNama.toUpperCase() + '</span></p>';
                        html += '</div>';
                        
                        // Kolom Kanan: Validasi & Kode (Background Merah)
                        html += '<div style="flex: 0 0 220px; background:#e50914; padding:20px; color:#fff; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">';
                        html += '<span style="font-size:14px; margin-bottom:10px; font-weight:bold; letter-spacing:1px;">TIKET (' + i + '/' + qty + ')</span>';
                        html += '<p style="margin:0; font-size:20px; font-family:monospace; font-weight:900; background:#fff; color:#000; padding:10px 15px; border-radius:5px; width:100%; box-sizing:border-box;">SVT-' + tgl + '-' + randCode + '</p>';
                        html += '</div>';
                        
                        html += '</div>'; // End Gelang Wrapper
                    }
                    html += '</div>';

                    pdfContainer.innerHTML = html;
                    pdfContainer.style.display = 'block';

                    // 6. Konfigurasi html2pdf (Orientation LANDSCAPE)
                    var opt = {
                        margin:       0.3,
                        filename:     filename,
                        image:        { type: 'jpeg', quality: 0.98 },
                        html2canvas:  { scale: 2, useCORS: true },
                        jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
                    };

                    // 7. Eksekusi Download
                    html2pdf().set(opt).from(pdfContainer).save().then(function(){
                        pdfContainer.style.display = 'none';
                        pdfContainer.innerHTML = '';
                        _btn.innerText = oldText; // Kembalikan teks tombol
                    });
                });
            });
        });
        </script>
        <?php
    }
}