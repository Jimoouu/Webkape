<?php
session_start();
include __DIR__ . '/../koneksi/koneksi.php';
?>

<!DOCTYPE html>
<html>
<head>

<title>Dashboard Admin | ABC Game Arena</title>

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
    background: linear-gradient(180deg, #4e73df     10%, #224abe 100%);
    position: fixed;
    transition: all 0.3s;
    box-shadow: 4px 0 10px rgba(0,0,0,0.1);
}

/* BAGIAN LOGO BARU */
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
    padding: 100px 40px 40px 40px;
}

h1 {
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 30px;
}

/* CARDS MODERN */
.card-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.card {
    background: white;
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border-left: 5px solid var(--primary);
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

.card h3 {
    margin: 0;
    font-size: 2rem;
    color: var(--dark);
}

.card p {
    margin: 5px 0 0;
    color: var(--secondary);
    text-transform: uppercase;
    font-size: 0.8rem;
    font-weight: 700;
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

.top-bar {
  width: calc(100% - var(--sidebar-width)); /* Lebar layar dikurangi lebar sidebar */
  margin-left: var(--sidebar-width);         /* Geser ke kanan agar tidak tertutup sidebar */
  height: 60px;
  background-color: #ffffff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 30px; /* Beri padding kanan agar foto tidak mepet tembok */
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  z-index: 1000;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 15px; /* Memberi jarak antara nama dan logo */
}

.admin-name {
  font-weight: 400;
  color: #333;
}

.profile-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%; /* Membuat logo jadi bulat */
  object-fit: cover;
  border: 2px solid #3b5998; /* Opsional: warna border sesuai tema biru kamu */
}


</style>

</head>

<body>

<div class="main-content">
  
  <div class="top-bar">
    <div class="profile-section">
      <span class="admin-name">Admin</span>
      <img src="user.jpg" alt="" class="profile-logo">
    </div>
  </div>

</div>

<div class="sidebar">

<div class="sidebar-brand">
    <img src="logo.jpg" alt="Logo ABC Arena" class="logo-img">
    <h2>ABC ARENA</h2>
</div>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

<div class="sidebar">

    <hr style="border: 0.1px solid rgba(255,255,255,0.1); margin: 10px 20px;">

    <a href="dashboard.php" class="active">
        <i class="fa-solid fa-house fa-fw"></i> Dashboard
    </a>
    
    <a href="menu.php">
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

<h1>Dashboard</h1>

<?php
$total_menu = mysqli_num_rows(mysqli_query($conn,"SELECT * FROM menu"));
$total_pesanan = mysqli_num_rows(mysqli_query($conn,"SELECT * FROM pesanan"));
$total_meja = mysqli_num_rows(mysqli_query($conn,"SELECT * FROM meja"));
?>

<div class="card-container">
        <div class="card" style="border-left-color: var(--primary);">
            <p>Total Menu</p>
            <h3><?php echo $total_menu; ?></h3>
        </div>

<div class="card" style="border-left-color: var(--success);">
            <p>Total Pesanan</p>
            <h3><?php echo $total_pesanan; ?></h3>
        </div>

<div class="card" style="border-left-color: var(--warning);">
            <p>Total Meja</p>
            <h3><?php echo $total_meja; ?></h3>
        </div>
</div>

<h2>Pesanan Terbaru</h2>    

<div class="table-container">
<table>
            <thead>
                <tr>
                    <th>Meja</th>
                    <th>Nama Pelanggan</th>
                    <th>Total Harga</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
<?php
$data = mysqli_query($conn,"SELECT * FROM pesanan ORDER BY id_pesanan DESC LIMIT 5");
while($d=mysqli_fetch_array($data)){
?>

<tr>
<td><?php echo $d['nomor_meja']; ?></td>
<td><?php echo $d['nama_pelanggan']; ?></td>
<td>Rp <?php echo number_format($d['total_harga']); ?></td>
<td><?php echo $d['status']; ?></td>
</tr>

<?php } ?>
            </tbody>
</table>

</div>

</body>
</html>