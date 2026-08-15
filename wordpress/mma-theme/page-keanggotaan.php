<?php 
get_header(); 

$post_id = get_the_ID();
$bg_url = get_post_meta($post_id, '_mma_bg_url', true);
$subtitle = get_post_meta($post_id, '_mma_subtitle', true);
$content = get_post_meta($post_id, '_mma_content', true);
?>
<main class="site-main page-bg">
    <section class="inner-hero" style="background-image: linear-gradient(rgba(10,10,10,0.8), rgba(10,10,10,0.9)), url('<?php echo esc_url($bg_url); ?>');">
        <div class="container">
            <h2 class="hero-subtitle"><?php echo esc_html($subtitle); ?></h2>
            <h1 class="inner-title" style="color: var(--red-neon);"><?php the_title(); ?></h1>
        </div>
    </section>

    <section class="container">
        <div class="glass-panel" style="max-width: 800px; margin: -80px auto 60px auto;">
            <div style="text-align:center; margin-bottom: 30px;">
                <?php echo apply_filters('the_content', $content); ?>
            </div>
            
            <?php 
            // NOTIFIKASI JIKA BERHASIL SUBMIT
            if (isset($_GET['status']) && $_GET['status'] == 'success') : 
            ?>
                <div style="background: rgba(0,255,0,0.1); border: 2px solid #00ff00; color: #00ff00; padding: 20px; margin-bottom: 30px; text-align: center; font-size: 1.2rem; font-weight: bold; border-radius: 5px;">
                    ✅ PENDAFTARAN BERHASIL TERKIRIM! DATA ATLET SUDAH MASUK KE SISTEM.
                </div>
            <?php endif; ?>
            
            <form action="<?php echo esc_url( admin_url('admin-post.php') ); ?>" method="POST" class="kombat-form">
                <input type="hidden" name="action" value="submit_atlet">
                
                <?php wp_nonce_field('submit_atlet_action', 'atlet_nonce_field'); ?>
                <div style="display:none; visibility:hidden; position:absolute; left:-9999px;">
                    <label>If you are human, leave this blank</label>
                    <input type="text" name="mma_bot_trap" value="" tabindex="-1" autocomplete="off">
                </div>
                
                <label>NAMA LENGKAP ATLET</label>
                <input type="text" name="atlet_name" required>
                
                <div class="form-row">
                    <div class="form-group half">
                        <label>ASAL SASANA / TIM</label>
                        <input type="text" name="asal_tim" required>
                    </div>
                    <div class="form-group half">
                        <label>WHATSAPP OFISIAL</label>
                        <input type="tel" name="no_wa" placeholder="08xxxxxxxxxx" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group half">
                        <label>TANGGAL LAHIR</label>
                        <input type="date" name="tanggal_lahir" required style="color:#fff; color-scheme: dark;">
                    </div>
                    <div class="form-group half">
                        <label>JENIS KELAMIN</label>
                        <select name="jenis_kelamin" required style="width: 100%; padding: 15px; background: #0a0a0a; border: 1px solid #333; color: #fff; font-family: var(--font-body); font-size: 1rem;">
                            <option value="">-- Pilih Jenis Kelamin --</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group half">
                        <label>BERAT BADAN (KG)</label>
                        <input type="number" step="0.1" name="berat_badan" placeholder="Contoh: 65.5" required>
                    </div>
                    <div class="form-group half">
                        <label>KATEGORI TANDING</label>
                        <div style="padding: 15px; background: #0a0a0a; border: 1px solid #333; color: #fff; display: flex; gap: 20px;">
                            <label style="display:inline-flex; align-items:center; margin:0; font-family: var(--font-body); font-size: 1rem; color: #fff; cursor:pointer;">
                                <input type="radio" name="kategori_tanding" value="Assaut" required style="width:auto; margin-right:10px;"> Assaut
                            </label>
                            <label style="display:inline-flex; align-items:center; margin:0; font-family: var(--font-body); font-size: 1rem; color: #fff; cursor:pointer;">
                                <input type="radio" name="kategori_tanding" value="Combat" required style="width:auto; margin-right:10px;"> Combat
                            </label>
                        </div>
                    </div>
                </div>
                
                <button type="submit" class="btn-neon w-100" style="margin-top: 30px;">SUBMIT DATA</button>
            </form>
        </div>
    </section>
</main>
<?php get_footer(); ?>