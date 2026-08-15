<?php 
/* Template Name: Form Pendaftaran Keanggotaan */
get_header(); 
?>
<main class="site-main page-bg">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
        <?php get_template_part('template-parts/global/page-hero'); ?>
        <section class="container" style="margin-top:-80px; position:relative; z-index:10; margin-bottom:80px;">
            <div style="text-align:center; margin-bottom:30px;"><?php the_content(); ?></div>
            <?php get_template_part('template-parts/forms/daftar-keanggotaan'); ?>
        </section>
    <?php endwhile; endif; ?>
</main>
<?php get_footer(); ?>