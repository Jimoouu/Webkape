import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from api.models import Menu, Table

def populate():
    # Tables
    for i in range(1, 11):
        Table.objects.get_or_create(number=i)
    print("Tables created")

    # Menu
    menus = [
        {"name": "Nasi Goreng Special", "category": "Makanan", "price": 25000},
        {"name": "Mie Goreng Bakso", "category": "Makanan", "price": 18000},
        {"name": "Ayam Geprek", "category": "Makanan", "price": 20000},
        {"name": "Es Teh Manis", "category": "Minuman", "price": 5000},
        {"name": "Kopi Susu Gula Aren", "category": "Minuman", "price": 12000},
        {"name": "Smoothies Mangga", "category": "Minuman", "price": 15000},
        {"name": "French Fries", "category": "Camilan", "price": 12000},
        {"name": "Pisang Keju", "category": "Camilan", "price": 10000},
    ]

    for m in menus:
        Menu.objects.get_or_create(name=m['name'], category=m['category'], price=m['price'])
    print("Menu items created")

if __name__ == '__main__':
    populate()
