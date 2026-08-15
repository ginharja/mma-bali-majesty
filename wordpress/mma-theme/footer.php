<footer class="site-footer" style="background: #000; padding: 40px 0; border-top: 2px solid var(--red-neon); text-align: center;">
        <div class="container">
            
            <div class="footer-logos-container">
                <?php
                $f_logos = array('mma_footer_logo_1', 'mma_footer_logo_2', 'mma_footer_logo_3', 'mma_footer_logo_4', 'mma_footer_logo_5');
                foreach($f_logos as $l) {
                    $img = get_theme_mod($l);
                    if($img) {
                        echo '<img src="'.esc_url($img).'" alt="Partner Logo" class="footer-logo-img">';
                    }
                }
                ?>
            </div>

            <h3 style="color: var(--red-neon); font-size: 2rem; margin-bottom: 10px; font-family: var(--font-heading);">MAJESTY BALI BALI</h3>
            <p style="color: #888; font-size: 1rem; margin: 0;">&copy; <?php echo date('Y'); ?>. Membangun generasi petarung tangguh dan berprestasi.</p>
        </div>
    </footer>
    <?php wp_footer(); ?>
</body>
</html>