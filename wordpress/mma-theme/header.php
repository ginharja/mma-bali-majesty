<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
    <meta name="google-site-verification" content="IM-KLz7MFFRuE4VRoXugIBsl4wBIcuHUkrnl_h8G3-8" />
    <!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '802047793283663');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=802047793283663&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
</head>
<body <?php body_class(); ?>>
    <header class="site-header">
        <div class="container header-inner">
            <div class="logo">
            <a href="<?php echo esc_url(home_url('/')); ?>" style="display: flex; align-items: center; text-decoration: none;">
                <?php 
                $header_logo = get_theme_mod('mma_header_logo');
                if ($header_logo) : 
                    // Jika logo diupload, tampilkan gambar
                    echo '<img src="' . esc_url($header_logo) . '" alt="MAJESTY BALI Logo" class="header-logo-img">';
                else : 
                    // Jika belum diupload, tampilkan teks bawaan
                    echo 'MAJESTY BALI';
                endif; 
                ?>
            </a>
        </div>
            <nav class="main-nav">
                <?php 
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container'      => false, // Menghilangkan div pembungkus bawaan WP
                    'menu_class'     => 'mma-menu', // Class CSS khusus untuk <ul>
                    'fallback_cb'    => false, // Jangan tampilkan apa pun jika menu belum di-assign
                )); 
                ?>
            </nav>
        </div>
    </header>