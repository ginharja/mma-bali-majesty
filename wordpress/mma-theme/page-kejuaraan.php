<?php 
/* Template Name: Halaman Kejuaraan (Khusus) */
get_header(); 
$post_id = get_the_ID();
$bg_url = get_post_meta($post_id, '_mma_bg_url', true);
$subtitle = get_post_meta($post_id, '_mma_subtitle', true);
$content = get_post_meta($post_id, '_mma_content', true);

// Tarik Data Baru
$fee_wni = get_post_meta($post_id, '_mma_fee_wni', true);
$fee_wna = get_post_meta($post_id, '_mma_fee_wna', true);
$img_piagam = get_post_meta($post_id, '_mma_img_piagam', true);
$img_medali = get_post_meta($post_id, '_mma_img_medali', true);
$pdf_proposal = get_post_meta($post_id, '_mma_pdf_proposal', true);
$pdf_thb = get_post_meta($post_id, '_mma_pdf_thb', true);
$pdf_form = get_post_meta($post_id, '_mma_pdf_formulir', true);

// FUNGSI HELPER ANTI-BLANK (Mengubah link Google Drive agar bisa di-embed)
function mma_safe_embed($url) {
    if (strpos($url, 'drive.google.com') !== false) {
        return preg_replace('/\/view.*/', '/preview', $url);
    }
    return $url . '#toolbar=0';
}
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
            
            <div class="post-content">
                <?php echo apply_filters('the_content', $content); ?>
            </div>

            <?php if($pdf_proposal || $pdf_thb || $pdf_form): ?>
            <div style="margin-top: 60px; padding-top: 40px; border-top: 1px solid #333;">
                <h3 style="color:var(--text-main); font-size: 3rem; text-align:center; margin-bottom: 30px;">DOKUMEN RESMI</h3>
                <div style="display: flex; gap: 30px; flex-wrap: wrap; justify-content: center;">
                    
                    <?php if($pdf_proposal): ?>
                    <div style="flex: 1; min-width: 280px; max-width: 400px; background: #0a0a0a; border: 1px solid #222; padding: 20px; text-align: center;">
                        <h4 style="font-size: 2rem; color: var(--red-neon); margin-bottom: 15px;">PROPOSAL</h4>
                        <div style="position: relative; width: 100%; height: 50vh; min-height: 400px; border: 1px solid #333; margin-bottom: 20px; background: #111;">
                            <iframe src="<?php echo esc_url(mma_safe_embed($pdf_proposal)); ?>" style="width: 100%; height: 100%; border: none;"></iframe>
                        </div>
                        <a href="<?php echo esc_url($pdf_proposal); ?>" target="_blank" download class="btn-neon" style="font-size: 1.1rem; padding: 12px; width: 100%; box-sizing: border-box;">DOWNLOAD PROPOSAL</a>
                    </div>
                    <?php endif; ?>

                    <?php if($pdf_thb): ?>
                    <div style="flex: 1; min-width: 280px; max-width: 400px; background: #0a0a0a; border: 1px solid #222; padding: 20px; text-align: center;">
                        <h4 style="font-size: 2rem; color: var(--red-neon); margin-bottom: 15px;">THB</h4>
                        <div style="position: relative; width: 100%; height: 50vh; min-height: 400px; border: 1px solid #333; margin-bottom: 20px; background: #111;">
                            <iframe src="<?php echo esc_url(mma_safe_embed($pdf_thb)); ?>" style="width: 100%; height: 100%; border: none;"></iframe>
                        </div>
                        <a href="<?php echo esc_url($pdf_thb); ?>" target="_blank" download class="btn-neon" style="font-size: 1.1rem; padding: 12px; width: 100%; box-sizing: border-box;">DOWNLOAD THB</a>
                    </div>
                    <?php endif; ?>

                    <?php if($pdf_form): ?>
                    <div style="flex: 1; min-width: 280px; max-width: 400px; background: #0a0a0a; border: 1px solid #222; padding: 20px; text-align: center;">
                        <h4 style="font-size: 2rem; color: var(--red-neon); margin-bottom: 15px;">FORMULIR</h4>
                        <div style="position: relative; width: 100%; height: 50vh; min-height: 400px; border: 1px solid #333; margin-bottom: 20px; background: #111;">
                            <iframe src="<?php echo esc_url(mma_safe_embed($pdf_form)); ?>" style="width: 100%; height: 100%; border: none;"></iframe>
                        </div>
                        <a href="<?php echo esc_url($pdf_form); ?>" target="_blank" download class="btn-neon" style="font-size: 1.1rem; padding: 12px; width: 100%; box-sizing: border-box;">DOWNLOAD FORMULIR</a>
                    </div>
                    <?php endif; ?>

                </div>
            </div>
            <?php endif; ?>

            <?php if($fee_wni || $fee_wna): ?>
            <div style="margin-top: 60px; padding-top: 40px; border-top: 1px solid #333;">
                <h3 style="color:var(--text-main); font-size: 3rem; text-align:center; margin-bottom: 30px;">BIAYA PENDAFTARAN</h3>
                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                    
                    <?php if($fee_wni): ?>
                    <div style="flex: 1; min-width: 250px; background: #0a0a0a; border: 1px solid #222; padding: 30px 20px; text-align: center; border-bottom: 4px solid var(--red-neon); transition: 0.3s;">
                        <h4 style="font-size: 2.2rem; color: #fff; margin-bottom: 5px;">ATLET WNI</h4>
                        <p style="font-size: 1rem; color: #888; margin-bottom: 15px;">Warga Negara Indonesia</p>
                        <div style="font-family: var(--font-heading); font-size: 3.5rem; color: var(--red-neon); line-height: 1;">
                            <span style="font-size: 1.8rem; color: #aaa; vertical-align: middle; margin-right: 5px;">IDR</span>
                            <?php echo is_numeric($fee_wni) ? number_format($fee_wni, 0, ',', '.') : esc_html($fee_wni); ?>
                        </div>
                    </div>
                    <?php endif; ?>
                    
                    <?php if($fee_wna): ?>
                    <div style="flex: 1; min-width: 250px; background: #0a0a0a; border: 1px solid #222; padding: 30px 20px; text-align: center; border-bottom: 4px solid #fff; transition: 0.3s;">
                        <h4 style="font-size: 2.2rem; color: #fff; margin-bottom: 5px;">ATLET WNA</h4>
                        <p style="font-size: 1rem; color: #888; margin-bottom: 15px;">Warga Negara Asing (Ekspatriat)</p>
                        <div style="font-family: var(--font-heading); font-size: 3.5rem; color: #fff; line-height: 1;">
                            <span style="font-size: 1.8rem; color: #aaa; vertical-align: middle; margin-right: 5px;">USD</span>
                            <?php echo is_numeric($fee_wna) ? number_format($fee_wna, 0, ',', '.') : esc_html($fee_wna); ?>
                        </div>
                    </div>
                    <?php endif; ?>

                </div>
            </div>
            <?php endif; ?>

            <?php if($img_piagam || $img_medali): ?>
            <div style="margin-top: 60px; padding-top: 40px; border-top: 1px solid #333;">
                <h3 style="color:var(--text-main); font-size: 3rem; text-align:center; margin-bottom: 30px;">SPESIMEN PENGHARGAAN</h3>
                <div style="display: flex; gap: 30px; flex-wrap: wrap; justify-content: center; text-align: center;">
                    
                    <?php if($img_piagam): ?>
                    <div style="flex: 1; min-width: 280px; max-width: 400px;">
                        <h4 style="font-size: 2rem; color: var(--red-neon); margin-bottom: 15px;">PIAGAM PRESTASI</h4>
                        <div style="border: 1px solid #333; padding: 10px; background: #000;">
                            <img src="<?php echo esc_url($img_piagam); ?>" alt="Spesimen Piagam mma" style="max-width: 100%; height: auto; display: block;">
                        </div>
                    </div>
                    <?php endif; ?>
                    
                    <?php if($img_medali): ?>
                    <div style="flex: 1; min-width: 280px; max-width: 400px;">
                        <h4 style="font-size: 2rem; color: var(--red-neon); margin-bottom: 15px;">MEDALI KEJUARAAN</h4>
                        <div style="border: 1px solid #333; padding: 10px; background: #000;">
                            <img src="<?php echo esc_url($img_medali); ?>" alt="Spesimen Medali mma" style="max-width: 100%; height: auto; display: block;">
                        </div>
                    </div>
                    <?php endif; ?>

                </div>
            </div>
            <?php endif; ?>

        </div>
    </section>
</main>
<?php get_footer(); ?>