<div class="form-wrapper glass-panel">
    <form action="<?php echo esc_url( admin_url('admin-post.php') ); ?>" method="POST" class="kombat-form">
        <input type="hidden" name="action" value="submit_atlet">
        <div class="form-group">
            <label>NAMA LENGKAP ATLET</label>
            <input type="text" name="atlet_name" required>
        </div>
        <div class="form-row">
            <div class="form-group half">
                <label>ASAL SASANA / TIM</label>
                <input type="text" name="asal_tim" required>
            </div>
            <div class="form-group half">
                <label>WHATSAPP OFISIAL</label>
                <input type="tel" name="no_wa" placeholder="08xxxxxxxxxx" required>
            </div>
        </div>
        <div class="form-group mt-4">
            <button type="submit" class="btn-neon w-100">DAFTARKAN ATLET</button>
        </div>
    </form>
</div>