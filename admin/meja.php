<?php
include __DIR__ . '/../koneksi/koneksi.php';

$data = mysqli_query($conn,"SELECT * FROM meja");
?>

<!DOCTYPE html>
<html>
<head>

<title>Data Meja</title>

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

/* BAGIAN LOGO (DITAMBAHKAN BIAR GANTENG) */
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
.btn {
    display: inline-block;
    padding: 10px 20px;
    background: var(--primary);
    color: white;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.85rem;
    transition: 0.3s;
    border: none;
    cursor: pointer;
    margin-bottom: 20px;
}

.btn:hover { opacity: 0.9; transform: scale(1.02); }

.btn-danger { 
    background: var(--danger); 
    color: white; 
    padding: 8px 15px; 
    border-radius: 5px; 
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: bold;
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
    
    <a href="menu.php">
        <i class="fa-solid fa-utensils fa-fw"></i> Kelola Menu
    </a>
    
    <a href="pesanan.php">
        <i class="fa-solid fa-clipboard-list fa-fw"></i> Data Pesanan
    </a>
    
    <a href="meja.php" class="active">
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

<h1>Data Meja</h1>

<a href="tambah_meja.php" class="btn">Tambah Meja</a>

<div class="table-container">
    <table>
        <thead>
            <tr>
                <th>Nomor Meja</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            <?php
            while($d=mysqli_fetch_array($data)){
            ?>
            <tr>
                <td><strong>Meja <?php echo $d['nomor_meja']; ?></strong></td>
                <td>
                    <a class="btn-danger" href="hapus_meja.php?id=<?php echo $d['id_meja']; ?>">
                        Hapus
                    </a>
                </td>
            </tr>
            <?php } ?>
        </tbody>
    </table>
</div>

</div>

</body>
</html>