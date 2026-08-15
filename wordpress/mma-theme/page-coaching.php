<?php 
/* Template Name: Halaman Coaching Clinic */
get_header(); 
$post_id = get_the_ID();
$bg_url = get_post_meta($post_id, '_mma_bg_url', true);
$subtitle = get_post_meta($post_id, '_mma_subtitle', true);
$content = get_post_meta($post_id, '_mma_content', true);

// Tarik Data Coaching Clinic
$cc_tanggal = get_post_meta($post_id, '_mma_cc_tanggal', true);
$cc_tempat = get_post_meta($post_id, '_mma_cc_tempat', true);
$cc_biaya = get_post_meta($post_id, '_mma_cc_biaya', true);
$cc_pemateri = get_post_meta($post_id, '_mma_cc_pemateri', true);
$cc_syarat = get_post_meta($post_id, '_mma_cc_syarat', true);
$cc_sertifikat = get_post_meta($post_id, '_mma_cc_sertifikat', true);
?>
<main class="site-main page-bg">
    <section class="inner-hero" style="background-image: linear-gradient(rgba(10,10,10,0.8), rgba(10,10,10,0.9)), url('<?php echo esc_url($bg_url); ?>');">
        <div class="container">
            <h2 class="hero-subtitle"><?php echo esc_html($subtitle); ?></h2>
            <h1 class="inner-title"><?php the_title(); ?></h1>
        </div>
    </section>

    <section class="container">
        <div class="glass-panel">
            
            <?php if($content): ?>
            <div class="post-content" style="margin-bottom: 50px;">
                <?php echo apply_filters('the_content', $content); ?>
            </div>
            <?php endif; ?>

            <?php if($cc_tanggal || $cc_tempat || $cc_biaya || $cc_pemateri): ?>
            <h3 style="color:var(--text-main); font-size: 3rem; text-align:center; margin-bottom: 30px; border-top: 1px solid #333; padding-top: 40px;">INFORMASI PELAKSANAAN</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 40px;">
                
                <?php if($cc_tanggal): ?>
                <div style="background: #0a0a0a; border: 1px solid #222; border-top: 3px solid var(--red-neon); padding: 20px; text-align: center;">
                    <span style="font-size: 2rem; display: block; margin-bottom: 10px;">📅</span>
                    <h4 style="font-size: 1.5rem; color: #888; margin-bottom: 5px;">TANGGAL</h4>
                    <p style="font-size: 1.2rem; color: #fff; font-weight: bold; margin: 0;"><?php echo esc_html($cc_tanggal); ?></p>
                </div>
                <?php endif; ?>

                <?php if($cc_tempat): ?>
                <div style="background: #0a0a0a; border: 1px solid #222; border-top: 3px solid var(--red-neon); padding: 20px; text-align: center;">
                    <span style="font-size: 2rem; display: block; margin-bottom: 10px;">📍</span>
                    <h4 style="font-size: 1.5rem; color: #888; margin-bottom: 5px;">LOKASI / VENUE</h4>
                    <p style="font-size: 1.2rem; color: #fff; font-weight: bold; margin: 0;"><?php echo esc_html($cc_tempat); ?></p>
                </div>
                <?php endif; ?>

                <?php if($cc_biaya): ?>
                <div style="background: #0a0a0a; border: 1px solid #222; border-top: 3px solid var(--red-neon); padding: 20px; text-align: center;">
                    <span style="font-size: 2rem; display: block; margin-bottom: 10px;">🎟️</span>
                    <h4 style="font-size: 1.5rem; color: #888; margin-bottom: 5px;">BIAYA INVESTASI</h4>
                    <p style="font-family: var(--font-heading); font-size: 2.5rem; color: var(--red-neon); line-height: 1; margin: 0;"><?php echo esc_html($cc_biaya); ?></p>
                </div>
                <?php endif; ?>

                <?php if($cc_pemateri): ?>
                <div style="background: #0a0a0a; border: 1px solid #222; border-top: 3px solid var(--red-neon); padding: 20px; text-align: center;">
                    <span style="font-size: 2rem; display: block; margin-bottom: 10px;">🥋</span>
                    <h4 style="font-size: 1.5rem; color: #888; margin-bottom: 5px;">PEMATERI</h4>
                    <p style="font-size: 1.2rem; color: #fff; font-weight: bold; margin: 0;"><?php echo esc_html($cc_pemateri); ?></p>
                </div>
                <?php endif; ?>

            </div>
            <?php endif; ?>

            <div style="display: flex; gap: 30px; flex-wrap: wrap; margin-top: 40px;">
                <?php if($cc_syarat): ?>
                <div style="flex: 1; min-width: 300px;">
                    <div style="background: #111; padding: 30px; border-left: 5px solid var(--red-neon); height: 100%; box-sizing: border-box;">
                        <h4 style="font-size: 2.2rem; color: #fff; margin-bottom: 15px; text-transform: uppercase;">Syarat & Ketentuan Peserta</h4>
                        <p style="color: #ccc; font-size: 1.1rem; line-height: 1.8; white-space: pre-line; margin: 0;">
                            <?php echo esc_html($cc_syarat); ?>
                        </p>
                    </div>
                </div>
                <?php endif; ?>

                <?php if($cc_sertifikat): ?>
                <div style="flex: 1; min-width: 300px; text-align: center;">
                    <h4 style="font-size: 2.2rem; color: var(--red-neon); margin-bottom: 15px;">SPESIMEN SERTIFIKAT KELULUSAN</h4>
                    <div style="border: 1px solid #333; padding: 10px; background: #000; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
                        <img src="<?php echo esc_url($cc_sertifikat); ?>" alt="Sertifikat Coaching Clinic mma" style="max-width: 100%; height: auto; display: block;">
                    </div>
                </div>
                <?php endif; ?>
            </div>

            <?php 
            $btn_text = get_post_meta($post_id, '_mma_btn_text', true);
            if($btn_text): 
            ?>
            <div style="text-align: center; margin-top: 60px; padding-top: 40px; border-top: 1px dashed #333;">
                <p style="color: #888; font-size: 1.2rem; margin-bottom: 20px;">Amankan kursi Anda sekarang. Kuota sangat terbatas!</p>
                <a href="/kontak" class="btn-neon" style="display: inline-block;"><?php echo esc_html($btn_text); ?></a>
            </div>
            <?php endif; ?>

        </div>
    </section>
</main>
<?php get_footer(); ?>