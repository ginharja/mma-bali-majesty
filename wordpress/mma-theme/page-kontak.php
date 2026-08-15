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
            <h1 class="inner-title"><?php the_title(); ?></h1>
        </div>
    </section>

    <section class="container">
        <div class="glass-panel">
            <div class="post-content"><?php echo apply_filters('the_content', $content); ?></div>
        </div>
    </section>
</main>
<?php get_footer(); ?>