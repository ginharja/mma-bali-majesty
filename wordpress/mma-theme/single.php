<?php get_header(); ?>

<?php while (have_posts()) : the_post(); 
    $hero_img = get_mma_dynamic_thumb(get_the_ID());
?>

<style>
    .kombat-single-view { background: #070707; color: #eee; font-family: 'Inter', sans-serif; overflow-x: hidden; }
    
    /* Hero Responsif */
    .hero-fixed {
        height: 60vh; min-height: 400px; width: 100%;
        background: linear-gradient(to bottom, rgba(0,0,0,0.2), #070707), url('<?php echo $hero_img; ?>') center/cover no-repeat;
        display: flex; align-items: flex-end; padding-bottom: 40px;
    }

    .container-wide { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: grid; grid-template-columns: 1fr 350px; gap: 40px; }

    /* Layout Content */
    .article-body-wrapper { padding: 40px 0; }
    .article-body-wrapper h1 { font-family: 'Teko'; font-size: clamp(2.5rem, 5vw, 4.5rem); line-height: 1; color: #fff; text-transform: uppercase; margin-bottom: 20px; }
    .article-meta-info { font-family: 'Teko'; font-size: 1.2rem; color: #e50914; letter-spacing: 2px; margin-bottom: 30px; border-bottom: 1px solid #222; padding-bottom: 10px; }
    
    .entry-content-text { line-height: 1.8; font-size: 1.1rem; color: #ccc; }
    .entry-content-text h2 { font-family: 'Teko'; font-size: 2.2rem; color: #fff; margin: 40px 0 20px; border-left: 4px solid #e50914; padding-left: 15px; }
    .entry-content-text img { max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0; }

    /* Sidebar Fix */
    .sidebar-sticky { position: sticky; top: 100px; height: fit-content; }
    .side-title { font-family: 'Teko'; font-size: 1.8rem; color: #fff; border-bottom: 2px solid #e50914; margin-bottom: 20px; text-transform: uppercase; }

    @media (max-width: 991px) {
        .container-wide { grid-template-columns: 1fr; }
        .hero-fixed { height: 45vh; }
        .sidebar-sticky { position: relative; top: 0; margin-top: 50px; }
    }
</style>

<div class="kombat-single-view">
    <div class="hero-fixed">
        <div class="container-wide" style="display:block;">
            <span style="background:#e50914; color:#fff; padding:4px 12px; font-family:'Teko'; font-size:1.1rem;">BERITA UTAMA</span>
        </div>
    </div>

    <div class="container-wide">
        <main class="article-body-wrapper">
            <h1><?php the_title(); ?></h1>
            <div class="article-meta-info">
                📅 <?php echo get_the_date(); ?> | 👤 ADMIN mma | 📂 ARTIKEL
            </div>

            <div class="entry-content-text">
                <?php the_content(); ?>
                <?php mma_global_share_buttons(); ?>
            </div>

            <div style="margin-top:50px;">
                <a href="https://wa.me/?text=<?php echo urlencode(get_the_title().' '.get_permalink()); ?>" target="_blank" style="background:#25d366; color:#fff; padding:12px 25px; text-decoration:none; font-family:'Teko'; font-size:1.4rem; border-radius:5px; display:inline-block;">SHARE KE WHATSAPP</a>
            </div>
        </main>

        <aside class="sidebar-sticky">
            <h3 class="side-title">Berita Terbaru</h3>
            <?php
            $q = new WP_Query(['posts_per_page' => 5, 'post__not_in' => [get_the_ID()]]);
            while ($q->have_posts()) : $q->the_post();
            ?>
                <a href="<?php the_permalink(); ?>" style="display:flex; gap:15px; margin-bottom:20px; text-decoration:none; color:inherit;">
                    <img src="<?php echo get_mma_dynamic_thumb(get_the_ID()); ?>" style="width:80px; height:80px; object-fit:cover; border-radius:4px;">
                    <h4 style="font-family:'Teko'; font-size:1.1rem; color:#fff; margin:0; line-height:1.2;"><?php the_title(); ?></h4>
                </a>
            <?php endwhile; wp_reset_postdata(); ?>
        </aside>
    </div>
</div>

<?php endwhile; ?>
<?php get_footer(); ?>