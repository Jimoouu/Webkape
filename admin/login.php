<?php
session_start();
include __DIR__ . '/../koneksi/koneksi.php';

if(isset($_POST['login'])){
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $password = $_POST['password']; 

    $data = mysqli_query($conn, "SELECT * FROM admin WHERE username='$username' AND password='$password'");
    $cek = mysqli_num_rows($data);

    if($cek > 0){
        $_SESSION['login'] = true;
        header("location:dashboard.php");
    } else {
        $error = "Username atau Password salah!";
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin | ABC Game Arena</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <style>
        :root {
            --primary: #4e73df;
            --secondary: #858796;
            --success: #1cc88a;
            --dark: #2c3e50;
            --light: #f4f7f6; /* WARNA BACKGROUND DASHBOARD */
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', 'Segoe UI', Roboto, sans-serif; }
        
        body {
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--light); /* SAMA DENGAN DASHBOARD */
            color: #333;
        }

        .login-container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
            border-top: 5px solid var(--primary);
        }

        .logo-login {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            margin-bottom: 20px;
            padding: 5px;
            background: white;
            border: 2px solid #eee;
            object-fit: contain;
        }

        h2 { 
            font-weight: 800; 
            color: var(--dark); 
            letter-spacing: 1px; 
            margin-bottom: 5px; 
            text-transform: uppercase;
        }

        p.subtitle { 
            color: var(--secondary); 
            font-size: 0.85rem; 
            margin-bottom: 30px; 
            font-weight: 700; 
            letter-spacing: 2px;
        }

        .form-group { 
            margin-bottom: 20px; 
            text-align: left; 
        }

        label { 
            display: block; 
            margin-bottom: 8px; 
            font-size: 0.8rem; 
            color: var(--secondary); 
            font-weight: 700; 
            text-transform: uppercase;
        }

        .input-wrapper {
            position: relative;
        }

        .input-wrapper i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--secondary);
        }

        input {
            width: 100%;
            padding: 12px 12px 12px 45px;
            border: 1px solid #d1d3e2;
            border-radius: 8px;
            background: #fff;
            color: #495057;
            outline: none;
            font-size: 0.9rem;
            transition: 0.3s;
        }

        input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
        }

        button {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 8px;
            background: var(--primary);
            color: white;
            font-weight: 700;
            font-size: 0.9rem;
            cursor: pointer;
            text-transform: uppercase;
            transition: 0.3s;
            margin-top: 10px;
        }

        button:hover {
            background: #2e59d9;
            transform: translateY(-1px);
        }

        .error-msg {
            background: #f8d7da;
            color: #721c24;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 0.85rem;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>

<div class="login-container">
    <img src="logo.jpg" alt="Logo" class="logo-login">
    
    <h2>Admin Login</h2>
    <p class="subtitle">ABC GAME ARENA</p>

    <?php if(isset($error)): ?>
        <div class="error-msg">
            <i class="fas fa-exclamation-circle"></i> <?php echo $error; ?>
        </div>
    <?php endif; ?>

    <form method="post">
        <div class="form-group">
            <label>Username</label>
            <div class="input-wrapper">
                <i class="fas fa-user"></i>
                <input type="text" name="username" placeholder="Username" required>
            </div>
        </div>

        <div class="form-group">
            <label>Password</label>
            <div class="input-wrapper">
                <i class="fas fa-lock"></i>
                <input type="password" name="password" placeholder="Password" required>
            </div>
        </div>

        <button type="submit" name="login">Login Ke Panel</button>
    </form>
</div>

</body>
</html>