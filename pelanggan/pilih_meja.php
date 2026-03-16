<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pilih Meja - ABC Game Arena</title>

    <style>
        :root {
            /* TEMA BIRU ROYAL */
            --primary-blue: #4e73df;
            --dark-blue: #224abe;
            --bg-light: #f4f7f6;
            --text-dark: #2c3e50;
            --white: #ffffff;
        }

        body {
            margin: 0;
            font-family: 'Inter', 'Segoe UI', sans-serif;
            background: var(--bg-light);
            color: var(--text-dark);
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
        }

        /* BACKGROUND BLUR BIRU */
        body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: url('WhatsApp Image 2026-03-13 at 20.48.40.jpeg');
            background-size: cover;
            background-position: center;
            filter: blur(8px) brightness(0.8);
            transform: scale(1.1);
            z-index: -1;
        }

        /* HEADER BIRU GRADASI */
        .header {
            background: linear-gradient(135deg, var(--primary-blue) 0%, var(--dark-blue) 100%);
            padding: 40px 20px;
            text-align: center;
            border-bottom: 4px solid var(--white);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            color: white;
            border-bottom-left-radius: 30px;
            border-bottom-right-radius: 30px;
        }

        .logo-main {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 4px solid var(--white);
            margin-bottom: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            object-fit: cover;
            background: white;
            padding: 5px;
        }

        .header h1 {
            margin: 0;
            font-size: 1.8rem;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .header p {
            margin: 5px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 600;
            font-size: 0.9rem;
            letter-spacing: 3px;
        }

        /* JUDUL */
        h2.title {
            text-align: center;
            margin-top: 40px;
            font-weight: 800;
            color: var(--white);
            text-transform: uppercase;
            letter-spacing: 1px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        /* CONTAINER MEJA */
        .container {
            width: 90%;
            max-width: 1000px;
            margin: 20px auto 50px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 20px;
        }

        .meja-card {
            background: rgba(255, 255, 255, 0.9);
            padding: 35px 20px;
            border-radius: 20px;
            border: 2px solid var(--white);
            text-align: center;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(10px);
            display: block;
            text-decoration: none;
            color: var(--primary-blue);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .meja-card:hover {
            background: var(--white);
            transform: translateY(-10px) scale(1.05);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            border-color: var(--primary-blue);
        }

        /* ICON MEJA */
        .meja-card i {
            display: block;
            font-size: 3.5rem;
            margin-bottom: 15px;
            color: var(--primary-blue);
            transition: 0.3s;
        }

        .meja-card:hover i {
            color: var(--dark-blue);
        }

        .meja-number {
            font-size: 1.4rem;
            font-weight: 800;
            color: var(--text-dark);
        }

        /* Responsive */
        @media (max-width: 600px) {
            .container {
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                width: 95%;
            }
            .header h1 { font-size: 1.4rem; }
            .meja-card { padding: 25px 15px; }
        }
    </style>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>

<body>

<div class="header">
    <img src="WhatsApp Image 2026-03-13 at 20.48.40.jpeg" alt="Logo ABC" class="logo-main">
    <h1>ABC GAME ARENA</h1>
    <p>BILLIARD & CAFE</p>
</div>

<h2 class="title">Pilih Nomor Meja</h2>

<div class="container">

    <?php for($i=1; $i<=12; $i++){ ?>
        <a href="menu.php?meja=<?php echo $i; ?>" class="meja-card">
            <i class="fas fa-couch"></i> 
            <div class="meja-number">Meja <?php echo $i; ?></div>
        </a>
    <?php } ?>

</div>

</body>
</html>