<?php
/** Template Name: Halaman Sponsor */
get_header(); ?>

<style>
    .sponsor-wrapper { background: #070707; color: #fff; padding-bottom: 100px; font-family: 'Inter', sans-serif; }
    .hero-sp { height: 40vh; display: flex; align-items: center; justify-content: center; text-align: center; background: linear-gradient(rgba(0,0,0,0.7), #070707), url('https://images.unsplash.com/photo-1599552375246-1be25c276b05?q=80&w=1920'); background-size: cover; border-bottom: 2px solid #e50914; }
    .hero-sp h1 { font-family: 'Teko'; font-size: 5rem; margin: 0; line-height: 1; }
    
    .container-sp { max-width: 1200px; margin: 0 auto; padding: 60px 20px; }
    .main-wording-area { line-height: 1.8; color: #ccc; margin-bottom: 80px; font-size: 1.15rem; }
    .main-wording-area h2 { font-family: 'Teko'; font-size: 2.5rem; color: #fff; margin-top: 40px; border-left: 4px solid #e50914; padding-left: 15px; }

    .kat-title { font-family: 'Teko'; font-size: 2.5rem; border-left: 5px solid #e50914; padding-left: 15px; margin: 60px 0 30px; text-transform: uppercase; color: #fff; }
    .grid-sp { display: grid; gap: 20px; margin-bottom: 50px; }
    .platinum-grid { grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); }
    .gold-grid { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
    .silver-grid { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }

    .card-sp { background: #111; border: 1px solid #222; padding: 40px; display: flex; flex-direction: column; align-items: center; transition: 0.3s; }
    .card-sp:hover { border-color: #e50914; transform: scale(1.03); }
    .card-sp img { max-width: 80%; height: 120px; object-fit: contain; filter: grayscale(1); transition: 0.3s; }
    .card-sp:hover img { filter: grayscale(0); }
    .sp-tag { margin-top: 20px; font-family: 'Teko'; font-size: 1rem; color: #666; letter-spacing: 2px; }
    .platinum-card { border: 1px solid #FFD700 !important; background: linear-gradient(145deg, #151515, #000) !important; }
</style>

<div class="sponsor-wrapper">
    <div class="hero-sp">
        <div>
            <h1>OUR <span style="color: #e50914;">PARTNERS</span></h1>
            <p style="font-family:'Teko'; font-size:1.5rem; letter-spacing:5px;">Sinergi Untuk Prestasi MAJESTY BALI</p>
        </div>
    </div>

    <div class="container-sp">
        <div class="main-wording-area">
            <?php 
            // LOGIKA DOUBLE CHECK: Ambil dari editor kustom atau editor default
            $custom_text = get_post_meta(get_the_ID(), '_mma_content', true);
            
            if (!empty($custom_text)) {
                echo apply_filters('the_content', $custom_text);
            } else {
                while ( have_posts() ) : the_post(); 
                    the_content(); 
                endwhile;
            }
            ?>
        </div>

        <hr style="border: 0; border-top: 1px solid #333; margin: 80px 0;">

        <?php 
        $all_sp = get_post_meta(get_the_ID(), '_mma_sponsors', true) ?: array();
        $kategori = array('platinum' => 'Platinum Partners', 'gold' => 'Gold Partners', 'silver' => 'Silver Partners');

        foreach ($kategori as $key => $label) : 
            $filtered = array_filter($all_sp, function($v) use ($key) { return isset($v['kat']) && $v['kat'] === $key; });
            if (!empty($filtered)) : ?>
                <h2 class="kat-title"><?php echo $label; ?></h2>
                <div class="grid-sp <?php echo $key; ?>-grid">
                    <?php foreach ($filtered as $s) : ?>
                        <div class="card-sp <?php echo $key; ?>-card">
                            <img src="<?php echo esc_url($s['logo']); ?>" alt="Logo Sponsor">
                            <div class="sp-tag">SINCE <?php echo esc_html($s['durasi']); ?></div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif;
        endforeach; ?>
    </div>
</div>

<?php get_footer(); ?>