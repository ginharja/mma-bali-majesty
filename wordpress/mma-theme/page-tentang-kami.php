<?php 
get_header(); 
$post_id = get_the_ID();
$bg_url = get_post_meta($post_id, '_mma_bg_url', true);
$subtitle = get_post_meta($post_id, '_mma_subtitle', true);
$content = get_post_meta($post_id, '_mma_content', true);
$youtube_url = get_post_meta($post_id, '_mma_youtube_url', true); // Tarik data URL YouTube
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
            
            <?php if($youtube_url): 
                // Mesin Regex Pintar untuk mengekstrak ID YouTube
                preg_match('%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/\s]{11})%i', $youtube_url, $match);
                $youtube_id = isset($match[1]) ? $match[1] : '';
                
                if($youtube_id):
            ?>
            <div style="margin-bottom: 40px; border-bottom: 1px solid #333; padding-bottom: 40px;">
                <h3 style="color:var(--text-main); font-size: 2.5rem; text-align:center; margin-bottom: 25px;">VIDEO DOKUMENTASI</h3>
                <div class="video-responsive-wrapper">
                    <iframe src="https://www.youtube.com/embed/<?php echo esc_attr($youtube_id); ?>" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            </div>
            <?php endif; endif; ?>

            <div class="post-content"><?php echo apply_filters('the_content', $content); ?></div>
            
        </div>
    </section>
</main>
<?php get_footer(); ?>