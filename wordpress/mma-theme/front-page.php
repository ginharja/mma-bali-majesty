<?php get_header(); ?>
<?php
$post_id = get_the_ID();
$bg_url = get_post_meta($post_id, '_mma_bg_url', true);
$subtitle = get_post_meta($post_id, '_mma_subtitle', true);
$btn_text = get_post_meta($post_id, '_mma_btn_text', true);
$content = get_post_meta($post_id, '_mma_content', true);
?>
<main class="site-main page-bg">
    <section class="hero-section" style="background-image: linear-gradient(to top, #070707 0%, rgba(10,10,10,0.4) 100%), url('<?php echo esc_url($bg_url); ?>');">
        <div class="container hero-content">
            <h2 class="hero-subtitle"><?php echo esc_html($subtitle); ?></h2>
            <h1 class="hero-title"><?php the_title(); ?></h1>
            <a href="/keanggotaan" class="btn-neon"><?php echo esc_html($btn_text); ?></a>
        </div>
    </section>

    <section class="about-section container">
        <div class="glass-panel">
            <h2 style="font-size:3rem; margin-bottom:15px;">ROAD TO GLORY</h2>
            <div class="post-content"><?php echo apply_filters('the_content', $content); ?></div>
        </div>
    </section>
</main>
<?php get_footer(); ?>