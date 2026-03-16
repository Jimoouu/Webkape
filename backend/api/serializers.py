from rest_framework import serializers
from .models import Table, Menu, Order, OrderItem, Payment

class TableSerializer(serializers.ModelSerializer):
    is_available = serializers.SerializerMethodField()

    class Meta:
        model = Table
        fields = '__all__'

    def get_is_available(self, obj):
        # Meja tidak tersedia jika ada pesanan berstatus 'menunggu' atau 'diproses'
        from .models import Order
        return not Order.objects.filter(table=obj, status__in=['menunggu', 'diproses']).exists()

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    menu_name = serializers.ReadOnlyField(source='menu.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'menu', 'menu_name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    table_number = serializers.ReadOnlyField(source='table.number')

    class Meta:
        model = Order
        fields = ['id', 'table', 'table_number', 'customer_name', 'total_price', 'status', 'created_at', 'items']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
