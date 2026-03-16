\<?php

include __DIR__ . '/../koneksi/koneksi.php';

$id = $_GET['id'];
$status = $_GET['s'];

mysqli_query($conn,"UPDATE pesanan SET status='$status' WHERE id_pesanan='$id'");

header("location:pesanan.php");