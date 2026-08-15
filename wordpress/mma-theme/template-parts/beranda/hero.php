<?php
$post_id  = get_the_ID();
$subtitle = get_post_meta($post_id, '_page_subtitle', true) ?: 'APRIL 2026 | BALI';
$bg_image = get_post_meta($post_id, '_page_bg', true) ?: 'https://images.unsplash.com/photo-1599552375246-1be25c276b05?q=80&w=1920&fit=crop';
$btn_text = get_post_meta($post_id, '_btn_text', true) ?: 'DAFTAR KEJUARAAN';
$btn_url  = get_post_meta($post_id, '_btn_url', true) ?: '/daftar-kejuaraan';
?>
<section class="hero-section" style="background-image: linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.5) 100%), url('<?php echo esc_url($bg_image); ?>');">
    <div class="container hero-content">
        <h2 class="hero-subtitle"><?php echo esc_html($subtitle); ?></h2>
        <h1 class="hero-title"><?php the_title(); ?></h1>
        <?php if($btn_text): ?>
            <a href="<?php echo esc_url($btn_url); ?>" class="btn-neon"><?php echo esc_html($btn_text); ?></a>
        <?php endif; ?>
    </div>
</section>