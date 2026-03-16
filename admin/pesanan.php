<?php
include __DIR__ . '/../koneksi/koneksi.php';

$data = mysqli_query($conn,"SELECT * FROM pesanan ORDER BY id_pesanan DESC");
?>

<!DOCTYPE html>
<html>
<head>

<title>Data Pesanan</title>

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
    margin-bottom: 30px;
}

/* TABLES MODERN */
.table-container {
    background: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
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
.btn-proses {
    padding: 5px 10px;
    background: var(--warning);
    color: #333;
    text-decoration: none;
    border-radius: 5px;
    font-size: 0.8rem;
    font-weight: bold;
}

.btn-selesai {
    padding: 5px 10px;
    background: var(--success);
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-size: 0.8rem;
    font-weight: bold;
}

.status-selesai { background: #e1f7ed; color: var(--success); font-weight: bold; padding: 5px; border-radius: 5px;}
.status-menunggu { background: #ffe9e9; color: var(--danger); font-weight: bold; padding: 5px; border-radius: 5px;}
.status-diproses { background: #fff4de; color: var(--warning); font-weight: bold; padding: 5px; border-radius: 5px;}

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
    
    <a href="menu.php">
        <i class="fa-solid fa-utensils fa-fw"></i> Kelola Menu
    </a>
    
    <a href="pesanan.php" class="active">
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

<h1>Data Pesanan</h1>

<div class="table-container">
<table>
    <thead>
        <tr>
            <th>Meja</th>
            <th>Nama</th>
            <th>Total</th>
            <th>Status</th>
            <th>Aksi</th>
        </tr>
    </thead>
    <tbody>
        <?php
        while($d=mysqli_fetch_array($data)){
            // Memastikan class status sesuai dengan isi database (kecilkan huruf)
            $status_class = strtolower($d['status']);
        ?>
        <tr>
            <td><?php echo $d['nomor_meja']; ?></td>
            <td><?php echo $d['nama_pelanggan']; ?></td>
            <td>Rp <?php echo number_format($d['total_harga']); ?></td>
            <td>
                <span class="status-<?php echo $status_class; ?>">
                    <?php echo $d['status']; ?>
                </span>
            </td>
            <td>
                <a class="btn-proses" href="update_status.php?id=<?php echo $d['id_pesanan']; ?>&s=diproses">Proses</a>
                <a class="btn-selesai" href="update_status.php?id=<?php echo $d['id_pesanan']; ?>&s=selesai">Selesai</a>
            </td>
        </tr>
        <?php } ?>
    </tbody>
</table>
</div>

</div>

</body>
</html>