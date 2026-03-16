<?php
include __DIR__ . '/../koneksi/koneksi.php';
?>

<!DOCTYPE html>
<html>
<head>

<title>Tambah Menu | ABC Game Arena</title>

<style>

:root {
    --primary: #4e73df;
    --secondary: #858796;
    --success: #1cc88a;
    --info: #36b9cc;
    --warning: #f6c23e;
    --danger: #e74a3b;
    --dark: #2c3e50;
    --light: #f8f9fc;
    --sidebar-width: 250px;
}

body {
    margin: 0;
    font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
    background-color: #f4f7f6;
    color: #333;
}

/* SIDEBAR REINVENTED */
.sidebar {
    width: var(--sidebar-width);
    height: 100vh;
    background: linear-gradient(180deg, #4e73df 10%, #224abe 100%);
    position: fixed;
    transition: all 0.3s;
    box-shadow: 4px 0 10px rgba(0,0,0,0.1);
}

/* BAGIAN LOGO (DITAMBAHKAN) */
.sidebar-brand {
    padding: 30px 0;
    text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.logo-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: white;
    padding: 5px;
    border: 2px solid white;
    margin-bottom: 10px;
    object-fit: contain;
}

.sidebar h2 {
    color: white;
    font-weight: 800;
    letter-spacing: 1px;
    margin: 0;
    font-size: 1.1rem;
    text-transform: uppercase;
}

.sidebar a {
    display: flex;
    align-items: center;
    color: rgba(255,255,255,0.8);
    padding: 15px 25px;
    text-decoration: none;
    transition: 0.2s;
    font-size: 0.95rem;
}

.sidebar a:hover {
    background: rgba(255,255,255,0.1);
    color: white;
    padding-left: 30px;
}

.sidebar a.active {
    background: rgba(0,0,0,0.1);
    color: white;
    border-left: 4px solid white;
}

/* MAIN CONTENT */
.content {
    margin-left: var(--sidebar-width);
    padding: 40px;
}

h1 {
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 20px;
}

/* FORM CARD */
.form-container {
    background: white;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    max-width: 600px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    font-weight: 600;
    color: var(--dark);
    margin-bottom: 8px;
    font-size: 0.9rem;
}

input[type="text"],
input[type="number"],
select {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 0.95rem;
    box-sizing: border-box; /* Biar input gak off-side */
}

input[type="file"] {
    background: #f8f9fc;
    padding: 10px;
    border-radius: 8px;
    width: 100%;
    border: 1px dashed var(--primary);
}

/* BUTTONS */
.btn-group {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.btn {
    padding: 12px 25px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    transition: 0.3s;
    border: none;
    cursor: pointer;
    text-align: center;
}

.btn-primary { background: var(--primary); color: white; }
.btn-secondary { background: var(--secondary); color: white; }

.btn:hover { opacity: 0.9; transform: scale(1.02); }

</style>

</head>

<body>

<div class="sidebar">
    <div class="sidebar-brand">
        <img src="logo.jpg" alt="Logo ABC Arena" class="logo-img">
        <h2>ABC ARENA</h2>
    </div>

    <a href="dashboard.php">🏠 Dashboard</a>
    <a href="menu.php" class="active">🍜 Kelola Menu</a>
    <a href="pesanan.php">📋 Data Pesanan</a>
    <a href="meja.php">🪑 Data Meja</a>
    <a href="pembayaran.php">💳 Pembayaran</a>
    <a href="laporan.php">📊 Laporan</a>
    <a href="logout.php">🚪 Logout</a>
</div>

<div class="content">

    <h1>Tambah Menu Baru</h1>

    <div class="form-container">
        <form action="simpan_menu.php" method="POST" enctype="multipart/form-data">
            
            <div class="form-group">
                <label>Nama Menu</label>
                <input type="text" name="nama_menu" placeholder="Contoh: Nasi Goreng Gila" required>
            </div>

            <div class="form-group">
                <label>Kategori</label>
                <select name="kategori">
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                </select>
            </div>

            <div class="form-group">
                <label>Harga (Rp)</label>
                <input type="number" name="harga" placeholder="Contoh: 15000" required>
            </div>

            <div class="form-group">
                <label>Foto Menu</label>
                <input type="file" name="gambar" required>
            </div>

            <div class="btn-group">
                <button type="submit" class="btn btn-primary">Simpan Menu</button>
                <a href="menu.php" class="btn btn-secondary">Batal</a>
            </div>

        </form>
    </div>

</div>

</body>
</html>