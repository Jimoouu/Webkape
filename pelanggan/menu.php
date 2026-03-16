<?php
include __DIR__ . '/../koneksi/koneksi.php';
$data = mysqli_query($conn,"SELECT * FROM menu");
$meja = isset($_GET['meja']) ? $_GET['meja'] : "";
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ABC Game Arena - Billiard & Cafe</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

    <style>
    :root {
        --primary: #4e73df;
        --success: #1cc88a;
        --bg-light: #f4f7f6;
        --text-dark: #2c3e50;
        --secondary-text: #858796;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Roboto, sans-serif; }

    body {
        background: var(--bg-light);
        color: var(--text-dark);
        padding-bottom: 50px;
    }

    /* HEADER */
    .header {
        background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
        padding: 30px 15px;
        text-align: center;
        color: white;
        border-bottom-left-radius: 30px;
        border-bottom-right-radius: 30px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .logo-main {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: white;
        padding: 5px;
        margin-bottom: 10px;
        border: 3px solid rgba(255,255,255,0.3);
    }

    /* CONTAINER */
    .container { width: 92%; max-width: 1200px; margin: -20px auto 0; }

    /* FORM BOX RAPIH (RESPONSIVE) */
    .form-box {
        background: white;
        padding: 20px;
        border-radius: 20px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        display: grid;
        grid-template-columns: 1fr; /* Default HP 1 kolom */
        gap: 15px;
        margin-bottom: 25px;
    }

    /* Desktop View: Form jadi 3 kolom */
    @media (min-width: 768px) {
        .form-box { grid-template-columns: 100px 1fr 1fr; align-items: end; }
    }

    .form-group { display: flex; flex-direction: column; gap: 5px; }
    
    .form-group label {
        font-size: 0.75rem;
        font-weight: 800;
        color: var(--primary);
        text-transform: uppercase;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    input, select {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #eaecf4;
        border-radius: 12px;
        background: #f8f9fc;
        color: #333;
        font-size: 0.95rem;
        transition: 0.3s;
        outline: none;
    }

    input:focus { border-color: var(--primary); background: white; }
    input[readonly] { background: #e9ecef; color: #6c757d; font-weight: bold; text-align: center; }

    /* SEARCH BAR */
    .search-container {
        position: relative;
        margin-bottom: 25px;
    }

    .search-container i {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--primary);
    }

    .search-container input {
        padding-left: 45px;
        border-radius: 50px;
        background: white;
        border: 2px solid #fff;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }

    /* MENU GRID */
    .menu-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* Tetap 2 kolom di HP biar gak sempit */
        gap: 12px;
    }

    @media (min-width: 768px) {
        .menu-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; }
    }

    .menu-card {
        background: white;
        border-radius: 18px;
        padding: 12px;
        border: 1px solid #edf2f7;
        display: flex;
        flex-direction: column;
        position: relative;
        transition: 0.3s;
    }

    .menu-card img {
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
        border-radius: 12px;
        margin-bottom: 10px;
    }

    .badge {
        position: absolute;
        top: 18px;
        left: 18px;
        background: var(--primary);
        color: white;
        padding: 3px 8px;
        font-size: 9px;
        font-weight: 800;
        border-radius: 6px;
        text-transform: uppercase;
    }

    .menu-card h3 { font-size: 0.85rem; font-weight: 700; margin: 5px 0; color: var(--text-dark); }
    .price { color: var(--success); font-weight: 800; font-size: 1rem; margin-bottom: 10px; }

    .qty-input {
        width: 100%;
        padding: 8px;
        text-align: center;
        border-radius: 8px;
        border: 2px solid #f1f3f9;
        font-weight: 800;
        color: var(--primary);
    }

    /* TOTAL BOX STICKY */
    .total-box {
        position: sticky;
        bottom: 15px;
        background: white;
        padding: 20px;
        border-radius: 20px;
        margin-top: 30px;
        box-shadow: 0 -10px 30px rgba(0,0,0,0.1);
        text-align: center;
        border: 2px solid var(--primary);
        z-index: 100;
    }

    .total-box h1 { color: var(--primary); font-size: 1.8rem; margin-bottom: 15px; }

    .btn {
        background: var(--primary);
        color: white;
        padding: 15px 30px;
        width: 100%;
        border: none;
        border-radius: 12px;
        font-weight: 800;
        text-transform: uppercase;
        cursor: pointer;
    }
    </style>

    <script>
    function hitungTotal(){
        let total = 0;
        let harga = document.querySelectorAll(".harga");
        let jumlah = document.querySelectorAll(".jumlah");
        for(let i=0; i<harga.length; i++){
            total += parseInt(harga[i].value) * parseInt(jumlah[i].value || 0);
        }
        document.getElementById("total").innerHTML = "Rp " + total.toLocaleString('id-ID');
    }

    function filterMenu() {
        let input = document.getElementById('searchInput').value.toLowerCase();
        let cards = document.getElementsByClassName('menu-card');
        for (let i = 0; i < cards.length; i++) {
            let title = cards[i].querySelector('h3').innerText.toLowerCase();
            cards[i].style.display = title.includes(input) ? "" : "none";
        }
    }
    </script>
</head>

<body>

<div class="header">
    <img src="WhatsApp Image 2026-03-13 at 20.48.40.jpeg" alt="Logo ABC" class="logo-main">
    <h1>ABC GAME ARENA</h1>
    <p>Billiard & Cafe</p>
</div>

<div class="container">
    <form action="pesan.php" method="POST">
        
        <div class="form-box">
            <div class="form-group">
                <label><i class="fas fa-hashtag"></i> Meja</label>
                <input type="number" name="meja" value="<?php echo $meja; ?>" readonly>
            </div>
            <div class="form-group">
                <label><i class="fas fa-user"></i> Nama Pelanggan</label>
                <input type="text" name="nama" required placeholder="Nama Anda">
            </div>
            <div class="form-group">
                <label><i class="fas fa-credit-card"></i> Pembayaran</label>
                <select name="metode">
                    <option value="cash">Cash (Ke Kasir)</option>
                    <option value="qris">QRIS (Otomatis)</option>
                </select>
            </div>
        </div>

        <div class="search-container">
            <i class="fas fa-search"></i>
            <input type="text" id="searchInput" onkeyup="filterMenu()" placeholder="Cari menu...">
        </div>

        <div class="menu-grid">
            <?php while($d=mysqli_fetch_array($data)){ ?>
            <div class="menu-card">
                <div class="badge"><?php echo $d['kategori']; ?></div>
                <img src="../gambar_menu/<?php echo $d['gambar']; ?>" onerror="this.src='https://via.placeholder.com/150'">
                <h3><?php echo $d['nama_menu']; ?></h3>
                <div class="price">Rp <?php echo number_format($d['harga'], 0, ',', '.'); ?></div>
                
                <input type="hidden" class="harga" value="<?php echo $d['harga']; ?>">
                
                <input type="number" class="jumlah qty-input" name="jumlah[<?php echo $d['id_menu']; ?>]" 
                       value="0" min="0" onchange="hitungTotal()" onkeyup="hitungTotal()">
            </div>
            <?php } ?>
        </div>

        <div class="total-box">
            <p style="font-size: 0.7rem; font-weight: bold; color: var(--secondary-text);">TOTAL PEMBAYARAN</p>
            <h1 id="total">Rp 0</h1>
            <button class="btn" type="submit">Konfirmasi Pesanan</button>
        </div>

    </form>
</div>

</body>
</html>