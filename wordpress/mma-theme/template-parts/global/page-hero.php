<?php
$post_id  = get_the_ID();
$subtitle = get_post_meta($post_id, '_page_subtitle', true) ?: 'MAJESTY BALI CUP';
$bg_image = get_post_meta($post_id, '_page_bg', true) ?: 'https://www.transparenttextures.com/patterns/carbon-fibre.png';
?>
<section class="page-hero" style="background-image: linear-gradient(rgba(10,10,10,0.8), rgba(10,10,10,0.9)), url('<?php echo esc_url($bg_image); ?>');">
    <div class="container text-center">
        <h2 class="hero-subtitle"><?php echo esc_html($subtitle); ?></h2>
        <h1 class="page-title" style="color: var(--red-neon);"><?php the_title(); ?></h1>
    </div>
</section>