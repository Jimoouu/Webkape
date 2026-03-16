<?php
include __DIR__ . '/../koneksi/koneksi.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

$meja = $_POST['meja'];
$nama = $_POST['nama'];
$metode = $_POST['metode'];

$total = 0;

foreach($_POST['jumlah'] as $id_menu => $jumlah){
    if($jumlah > 0){
        $menu = mysqli_fetch_array(
            mysqli_query($conn,"SELECT * FROM menu WHERE id_menu='$id_menu'")
        );
        $total += $menu['harga'] * $jumlah;
    }
}

// Simpan Pesanan
mysqli_query($conn,"INSERT INTO pesanan (nomor_meja,nama_pelanggan,total_harga,status) VALUES ('$meja','$nama','$total','menunggu')");
$id_pesanan = mysqli_insert_id($conn);

// Simpan Pembayaran
mysqli_query($conn,"INSERT INTO pembayaran (id_pesanan,metode,status) VALUES ('$id_pesanan','$metode','belum')");
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Konfirmasi Pembayaran - ABC Game Arena</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <style>
        :root {
            --primary-blue: #4e73df;
            --dark-blue: #224abe;
            --success-green: #1cc88a;
            --bg-light: #f4f7f6;
            --text-dark: #2c3e50;
            --white: #ffffff;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
            background-color: var(--bg-light);
            color: var(--text-dark);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
        }

        /* BACKGROUND BLUR CERAH */
        body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: url('biliard.jpg'); 
            background-size: cover; 
            background-position: center;
            filter: blur(10px) brightness(0.8);
            transform: scale(1.1);
            z-index: -1;
        }

        .box {
            background: rgba(255, 255, 255, 0.9);
            width: 90%;
            max-width: 450px;
            padding: 40px 30px;
            border-radius: 30px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            text-align: center;
            border: 2px solid var(--white);
            backdrop-filter: blur(15px);
            animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        h2 { color: var(--primary-blue); font-weight: 800; margin-bottom: 5px; }
        p { color: #5a5c69; font-size: 0.95rem; line-height: 1.5; }
        h1 { font-size: 2.8rem; margin: 15px 0; color: var(--text-dark); font-weight: 800; }

        .qris-img {
            width: 220px;
            height: 220px;
            margin: 20px 0;
            padding: 10px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border: 1px solid #ddd;
        }

        .btn-container {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
        }

        .btn {
            flex: 1;
            padding: 14px;
            border: none;
            border-radius: 15px;
            font-weight: 800;
            cursor: pointer;
            text-decoration: none;
            font-size: 14px;
            transition: 0.3s;
            display: inline-block;
            text-transform: uppercase;
        }

        .btn-pesan {
            background: #eaecf4;
            color: var(--primary-blue);
        }

        .btn-selesai {
            background: var(--primary-blue);
            color: white;
            box-shadow: 0 4px 15px rgba(78, 115, 223, 0.3);
        }

        .btn:hover {
            transform: translateY(-3px);
            filter: brightness(1.1);
        }

        .icon-check {
            font-size: 60px;
            color: var(--success-green);
            margin-bottom: 15px;
        }
    </style>
</head>

<body>

<div class="box">
    <?php if($metode == "qris"): ?>
        <h2>PEMBAYARAN QRIS</h2>
        <p>Silakan selesaikan pembayaran sebesar:</p>
        <h1>Rp <?php echo number_format($total, 0, ',', '.'); ?></h1>
        
        <img src="qris_toko.jpg" class="qris-img" alt="QRIS Toko">
        
        <p>Scan QR di atas melalui aplikasi bank atau e-wallet (OVO, Dana, GoPay, dll).</p>
    <?php else: ?>
        <div class="icon-check">
            <i class="fas fa-check-circle"></i>
        </div>
        <h2>PESANAN DITERIMA!</h2>
        <p>Total tagihan yang harus dibayar di kasir:</p>
        <h1 style="color: var(--primary-blue);">Rp <?php echo number_format($total, 0, ',', '.'); ?></h1>
        <p>Berikan nomor meja atau tunjukkan layar ini kepada petugas untuk konfirmasi.</p>
    <?php endif; ?>

    <div class="btn-container">
        <a href="pilih_meja.php" class="btn btn-pesan">Pesan Lagi</a>
        <a href="pilih_meja.php" class="btn btn-selesai">Selesai</a>
    </div>
</div>

</body>
</html>