from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.db import transaction
from django.utils import timezone
from .models import Table, Menu, Order, OrderItem, Payment
from .serializers import TableSerializer, MenuSerializer, OrderSerializer, OrderItemSerializer, PaymentSerializer

class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all().order_by('number')
    serializer_class = TableSerializer
    permission_classes = [AllowAny]

class MenuViewSet(viewsets.ModelViewSet):
    queryset = Menu.objects.all().order_by('id')
    serializer_class = MenuSerializer
    permission_classes = [AllowAny]

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.is_staff:
                return Order.objects.all().order_by('-created_at')
            return Order.objects.filter(user=user).order_by('-created_at')
        return Order.objects.none()

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data
        table_id = data.get('table')
        customer_name = data.get('customer_name', '')
        items_data = data.get('items', [])

        if not table_id:
            return Response({"error": "Table is required."}, status=status.HTTP_400_BAD_REQUEST)

        if not customer_name:
            # Fallback: use username if authenticated
            if request.user.is_authenticated:
                customer_name = request.user.username
            else:
                customer_name = 'Tamu'

        try:
            table = Table.objects.get(id=table_id)
        except Table.DoesNotExist:
            return Response({"error": "Table does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            table=table,
            customer_name=customer_name,
            total_price=0,
            status='menunggu'
        )

        total_price = 0
        for item_data in items_data:
            menu_id = item_data.get('menu')
            quantity = item_data.get('quantity', 1)

            try:
                menu = Menu.objects.get(id=menu_id)
            except Menu.DoesNotExist:
                return Response({"error": f"Menu item {menu_id} does not exist."}, status=status.HTTP_400_BAD_REQUEST)

            price = menu.price
            total_price += price * quantity

            OrderItem.objects.create(
                order=order,
                menu=menu,
                quantity=quantity,
                price=price
            )

        order.total_price = total_price
        order.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        from django.db.models import Sum, Count, F
        from django.db.models.functions import TruncDate
        from datetime import timedelta

        today = timezone.now().date()
        period = int(request.query_params.get('period', 7))
        start_date = today - timedelta(days=period - 1)

        # Overview Stats
        total_revenue = sum(o.total_price for o in Order.objects.filter(status='selesai'))
        total_orders = Order.objects.count()
        completed_orders = Order.objects.filter(status='selesai').count()
        todays_orders = Order.objects.filter(created_at__date=today).count()

        # Revenue Trend
        trend_query = Order.objects.filter(
            status='selesai',
            created_at__date__range=[start_date, today]
        ).annotate(date=TruncDate('created_at')).values('date').annotate(
            revenue=Sum('total_price'),
            orders=Count('id')
        ).order_by('date')
        
        # Prepare trend data with all days in period (to fill zero gaps)
        trend_dict = {str(item['date']): {'revenue': item['revenue'], 'orders': item['orders']} for item in trend_query}
        trend = []
        for i in range(period):
            d = start_date + timedelta(days=i)
            d_str = str(d)
            trend.append({
                'date': d_str,
                'revenue': trend_dict.get(d_str, {}).get('revenue', 0),
                'orders': trend_dict.get(d_str, {}).get('orders', 0)
            })

        # Top Menus
        top_menus_query = OrderItem.objects.filter(
            order__status='selesai',
            order__created_at__date__range=[start_date, today]
        ).values('menu__name').annotate(
            sales=Sum('quantity'),
            revenue=Sum(F('quantity') * F('price'))
        ).order_by('-sales')[:5]

        top_menus = [
            {'name': item['menu__name'], 'sales': item['sales'], 'revenue': item['revenue']}
            for item in top_menus_query
        ]

        # Table Usage
        table_usage_query = Order.objects.filter(
            created_at__date__range=[start_date, today]
        ).values('table__number').annotate(
            usages=Count('id')
        ).order_by('-usages')[:5]

        table_usage = [
            {'name': f"Meja {item['table__number']}", 'usages': item['usages']}
            for item in table_usage_query
        ]

        return Response({
            "total_revenue": total_revenue,
            "total_orders": total_orders,
            "completed_orders": completed_orders,
            "todays_orders": todays_orders,
            "revenue_trend": trend,
            "top_menus": top_menus,
            "table_usage": table_usage
        })

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by('-created_at')
    serializer_class = PaymentSerializer
    permission_classes = [AllowAny]

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_staff'] = user.is_staff
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['is_staff'] = self.user.is_staff
        data['id'] = self.user.id
        data['username'] = self.user.username
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
