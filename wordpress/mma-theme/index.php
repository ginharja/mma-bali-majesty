<?php get_header(); ?>

<style>
    /* CSS PAGINATION KOMBAT */
    .kombat-pagination { display: flex; justify-content: center; gap: 10px; margin-top: 50px; }
    .kombat-pagination .page-numbers {
        background: #111;
        color: #fff;
        padding: 10px 18px;
        text-decoration: none;
        font-family: 'Teko', sans-serif;
        font-size: 1.4rem;
        border: 1px solid #333;
        transition: 0.3s;
    }
    .kombat-pagination .page-numbers.current { background: #e50914; border-color: #e50914; color: #fff; box-shadow: 0 0 15px rgba(229, 9, 20, 0.4); }
    .kombat-pagination .page-numbers:hover:not(.current) { border-color: #FFD700; color: #FFD700; }

    /* REVISI READ MORE */
    .kombat-btn-more {
        display: inline-block;
        margin-top: auto;
        padding: 8px 0;
        color: #e50914;
        font-family: 'Teko', sans-serif;
        font-size: 1.2rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: 0.3s;
        border-bottom: 2px solid transparent;
    }
    .kombat-card:hover .kombat-btn-more { border-color: #e50914; padding-left: 10px; }

    /* STICKY CARD REFINEMENT */
    .kombat-card.is-pinned {
        border: 1px solid #FFD700 !important;
        background: linear-gradient(145deg, #1a1a15, #000) !important;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
    }
</style>

<main style="background: #070707; min-height: 100vh; padding-top: 50px; padding-bottom: 100px;">
    <header style="text-align: center; margin-bottom: 60px;">
        <h1 style="font-family: 'Teko'; font-size: 5rem; color: #fff; text-transform: uppercase; margin: 0; line-height: 1;">
            ARENA <span style="color: #e50914;">BERITA</span>
        </h1>
        <div style="width: 100px; height: 4px; background: #e50914; margin: 20px auto;"></div>
    </header>

    <div class="kombat-blog-grid">
        <?php 
        // Agar sticky selalu di atas pada tiap paging, kita ambil ID sticky
        $sticky = get_option('sticky_posts');
        
        if (have_posts()) : 
            while (have_posts()) : the_post(); 
                $is_pinned = is_sticky();
                $final_thumb = get_mma_dynamic_thumb(get_the_ID()); 
        ?>
            <article class="kombat-card <?php echo $is_pinned ? 'is-pinned' : ''; ?>">
                <a href="<?php the_permalink(); ?>" style="text-decoration: none; display: flex; flex-direction: column; h-100;">
                    
                    <div class="kombat-thumb-wrapper">
                        <div class="kombat-badge" style="<?php echo $is_pinned ? 'background: #FFD700; color: #000;' : ''; ?>">
                            <?php echo $is_pinned ? '📌 SOROTAN UTAMA' : 'NEWS'; ?>
                        </div>
                        <img src="<?php echo esc_url($final_thumb); ?>" alt="<?php the_title(); ?>">
                    </div>

                    <div class="kombat-card-body">
                        <div class="kombat-meta">
                            📅 <?php echo get_the_date(); ?> <?php echo $is_pinned ? '<span style="color:#FFD700">| PINNED</span>' : ''; ?>
                        </div>
                        
                        <h2 style="<?php echo $is_pinned ? 'color: #FFD700;' : ''; ?> font-family: 'Teko'; font-size: 1.8rem; margin: 10px 0;">
                            <?php the_title(); ?>
                        </h2>

                        <div class="kombat-excerpt" style="color: #888; font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">
                            <?php echo wp_trim_words(get_the_excerpt(), 15); ?>
                        </div>

                        <div class="kombat-btn-more">
                            BACA SELENGKAPNYA <span style="font-size: 1.4rem;">→</span>
                        </div>
                    </div>
                </a>
            </article>
        <?php endwhile; else : ?>
            <p style="color:#fff; text-align:center; grid-column: 1/-1;">Belum ada berita.</p>
        <?php endif; ?>
    </div>

    <div class="container">
        <?php 
        echo get_the_posts_pagination(array(
            'mid_size'  => 2,
            'prev_text' => '← PREV',
            'next_text' => 'NEXT →',
        )); 
        ?>
    </div>
</main>

<?php get_footer(); ?>