<?php
session_start();
include __DIR__ . '/../koneksi/koneksi.php';
$data = mysqli_query($conn, "SELECT * FROM menu");
?>

<!DOCTYPE html>
<html>
<head>

<title>Kelola Menu | ABC Game Arena</title>

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

/* SIDEBAR IDENTIK DASHBOARD */
.sidebar {
    width: var(--sidebar-width);
    height: 100vh;
    background: linear-gradient(180deg, #4e73df 10%, #224abe 100%);
    position: fixed;
    transition: all 0.3s;
    box-shadow: 4px 0 10px rgba(0,0,0,0.1);
}

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

.sidebar a i {
    width: 25px;          /* Membuat lebar kotak ikon sama semua */
    margin-right: 15px;   /* Jarak antara ikon dan tulisan */
    text-align: center;   /* Agar ikon yang kurus tetap di tengah */
    font-size: 1.1rem;    /* Ukuran ikon sedikit lebih besar */
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
    margin-bottom: 10px;
}

/* TABLE STYLING */
.table-container {
    background: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    margin-top: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    background: #f8f9fc;
    color: var(--secondary);
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 1px;
    padding: 15px;
    text-align: left;
    border-bottom: 2px solid #edf2f7;
}

td {
    padding: 15px;
    border-bottom: 1px solid #edf2f7;
    font-size: 0.9rem;
    color: #555;
}

tr:hover td {
    background-color: #fbfcfe;
}

/* BUTTONS */
.btn {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.85rem;
    transition: 0.3s;
    border: none;
    cursor: pointer;
    color: white;
}

.btn-primary { background: var(--primary); margin-bottom: 20px; }
.btn-info { background: var(--info); }
.btn-danger { background: var(--danger); }

.btn:hover { opacity: 0.8; transform: scale(1.02); }

/* POPUP */
.popup-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.popup-box {
    background: white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

</style>

</head>

<body>

<div class="sidebar">
    <div class="sidebar-brand">
        <img src="logo.jpg" alt="Logo ABC Arena" class="logo-img">
        <h2>ABC ARENA</h2>
    </div>
    
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

<div class="sidebar">

    <hr style="border: 0.1px solid rgba(255,255,255,0.1); margin: 10px 20px;">

    <a href="dashboard.php">
        <i class="fa-solid fa-house fa-fw"></i> Dashboard
    </a>
    
    <a href="menu.php" class="active">
        <i class="fa-solid fa-utensils fa-fw"></i> Kelola Menu
    </a>
    
    <a href="pesanan.php">
        <i class="fa-solid fa-clipboard-list fa-fw"></i> Data Pesanan
    </a>
    
    <a href="meja.php">
        <i class="fa-solid fa-table-cells fa-fw"></i> Data Meja
    </a>
    
    <a href="pembayaran.php">
        <i class="fa-solid fa-receipt fa-fw"></i> Pembayaran
    </a>
    
    <a href="laporan.php">
        <i class="fa-solid fa-chart-simple fa-fw"></i> Laporan
    </a>

    <hr style="border: 0.1px solid rgba(255,255,255,0.1); margin: 10px 20px;">

    <a href="logout.php" class="logout-link">
        <i class="fa-solid fa-right-from-bracket fa-fw"></i> Logout
    </a>
</div>
</div>

<div class="content">

    <h1>Kelola Menu</h1>
    <a href="tambah_menu.php" class="btn btn-primary">+ Tambah Menu</a>

    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Gambar</th>
                    <th>Nama Menu</th>
                    <th>Kategori</th>
                    <th>Harga</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php while($d=mysqli_fetch_array($data)){ ?>
                <tr>
                    <td>
                        <img src="../gambar_menu/<?php echo $d['gambar']; ?>" width="60" style="border-radius: 5px;">
                    </td>
                    <td><strong><?php echo $d['nama_menu']; ?></strong></td>
                    <td><?php echo $d['kategori']; ?></td>
                    <td>Rp <?php echo number_format($d['harga']); ?></td>
                    <td>
                        <a href="stok_menu.php?id=<?php echo $d['id_menu']; ?>" class="btn btn-info">📦 Stok</a>
                        
                        <button class="btn btn-danger" onclick="hapusMenu(<?php echo $d['id_menu']; ?>)">🗑️ Hapus</button>
                    </td>
                </tr>
                <?php } ?>
            </tbody>
        </table>
    </div>
</div>

<div id="popupHapus" class="popup-overlay">
    <div class="popup-box">
        <h3>Yakin ingin menghapus menu ini?</h3>
        <p style="color: var(--secondary);">Data tidak bisa dikembalikan setelah dihapus.</p>
        <button class="btn btn-danger" onclick="lanjutHapus()">Ya, Hapus</button>
        <button class="btn" style="background: #ccc; color: #333;" onclick="tutupPopup()">Batal</button>
    </div>
</div>

<script>
    let idMenu = null;

    function hapusMenu(id){
        idMenu = id;
        document.getElementById("popupHapus").style.display="flex";
    }

    function tutupPopup(){
        document.getElementById("popupHapus").style.display="none";
    }

    function lanjutHapus(){
        window.location="hapus_menu.php?id="+idMenu;
    }
</script>

</body>
</html>