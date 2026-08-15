<?php 
/* Template Name: Halaman Tiket (Kombat Style) */
get_header(); 
$post_id = get_the_ID();

// Menarik data Meta Box (Gambar latar, subtitle, konten teks) sama seperti halaman kejuaraan
$bg_url = get_post_meta($post_id, '_mma_bg_url', true) ?: 'https://images.unsplash.com/photo-1599552375246-1be25c276b05?q=80&w=1920&fit=crop';
$subtitle = get_post_meta($post_id, '_mma_subtitle', true) ?: 'PEMESANAN TIKET & AKSES ARENA';
$content = get_post_meta($post_id, '_mma_content', true);
?>

<style>
    .tiket-hero {
        background-image: linear-gradient(rgba(10,10,10,0.8), rgba(10,10,10,0.9)), url('<?php echo esc_url($bg_url); ?>');
        padding: 100px 20px 60px;
        text-align: center;
        background-size: cover;
        background-position: center;
        border-bottom: 2px solid #FFD700;
    }
    .tiket-subtitle {
        color: #FFD700;
        font-family: 'Teko', sans-serif;
        font-size: 1.8rem;
        letter-spacing: 2px;
        margin-bottom: 10px;
        text-transform: uppercase;
    }
    .tiket-title {
        color: #fff;
        font-family: 'Teko', sans-serif;
        font-size: 4rem;
        line-height: 1;
        margin: 0;
        text-transform: uppercase;
        text-shadow: 0 5px 15px rgba(0,0,0,0.8);
    }
    .tiket-container {
        max-width: 900px;
        margin: -40px auto 60px;
        position: relative;
        z-index: 10;
        padding: 0 20px;
    }
    .tiket-content-box {
        background: #0a0a0a;
        border: 1px solid #333;
        padding: 40px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .tiket-content-box p { color: #ccc; line-height: 1.8; font-size: 1.1rem; }
    .tiket-content-box h2, .tiket-content-box h3 { color: #fff; font-family: 'Teko', sans-serif; }
    
    @media (max-width: 768px) {
        .tiket-title { font-size: 3rem; }
        .tiket-content-box { padding: 20px; }
    }
</style>

<main class="site-main page-bg" style="background:#000;">
    
    <section class="tiket-hero">
        <div class="container">
            <h2 class="tiket-subtitle"><?php echo esc_html($subtitle); ?></h2>
            <h1 class="tiket-title"><?php the_title(); ?></h1>
        </div>
    </section>

    <section class="tiket-container">
        <div class="tiket-content-box">
            
            <?php if (!empty($content)) : ?>
                <div class="post-content" style="margin-bottom: 40px; border-bottom: 1px dashed #333; padding-bottom: 20px;">
                    <?php echo apply_filters('the_content', $content); ?>
                </div>
            <?php endif; ?>
            
            <?php echo do_shortcode('[mma_form_tiket]'); ?>
            
        </div>
    </section>
    
</main>

<?php get_footer(); ?>