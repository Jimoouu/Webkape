<?php

include __DIR__ . '/../koneksi/koneksi.php';

$nama = $_POST['nama_menu'];
$kategori = $_POST['kategori'];
$harga = $_POST['harga'];

$gambar = $_FILES['gambar']['name'];
$tmp = $_FILES['gambar']['tmp_name'];

move_uploaded_file($tmp,"../gambar_menu/".$gambar);

mysqli_query($conn,"INSERT INTO menu VALUES(NULL,'$nama','$kategori','$harga','$gambar')");

header("location:menu.php");