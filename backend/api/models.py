from django.db import models
from django.contrib.auth.models import User

class Table(models.Model):
    number = models.IntegerField(unique=True)

    def __str__(self):
        return f"Meja {self.number}"

class Menu(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50)  # e.g., Makanan, Minuman, Snak
    price = models.IntegerField()
    image = models.ImageField(upload_to='menu_images/', null=True, blank=True)
    image_url = models.URLField(max_length=500, null=True, blank=True)  # For online images
    is_available = models.BooleanField(default=True)
    discount_price = models.IntegerField(default=0)  # Potongan harga (e.g., 5000 means Rp 5.000 off)

    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('menunggu', 'Menunggu'),
        ('diproses', 'Diproses'),
        ('selesai', 'Selesai'),
        ('dibatalkan', 'Dibatalkan'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='orders')
    customer_name = models.CharField(max_length=100)
    total_price = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='menunggu')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - Meja {self.table.number} ({self.customer_name})"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price = models.IntegerField()  # Snapshot at order time

    def __str__(self):
        return f"{self.quantity}x {self.menu.name} (Order {self.order.id})"

class Payment(models.Model):
    METHOD_CHOICES = [
        ('qris', 'QRIS'),
        ('cash', 'Tunai'),
    ]
    STATUS_CHOICES = [
        ('lunas', 'Lunas'),
        ('belum', 'Belum Bayar'),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    method = models.CharField(max_length=10, choices=METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='belum')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.id} for Order {self.order.id} ({self.status})"
