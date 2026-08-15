<div class="form-wrapper glass-panel">
    <form action="<?php echo esc_url( admin_url('admin-post.php') ); ?>" method="POST" class="kombat-form">
        <input type="hidden" name="action" value="submit_anggota">
        <div class="form-group">
            <label>NAMA LENGKAP CALON ANGGOTA</label>
            <input type="text" name="anggota_name" required>
        </div>
        <div class="form-group">
            <label>NOMOR WHATSAPP</label>
            <input type="tel" name="no_wa_anggota" required>
        </div>
        <div class="form-group mt-4">
            <button type="submit" class="btn-neon w-100">GABUNG SEKARANG</button>
        </div>
    </form>
</div>