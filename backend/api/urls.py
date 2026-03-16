from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TableViewSet, MenuViewSet, OrderViewSet, PaymentViewSet

router = DefaultRouter()
router.register(r'tables', TableViewSet)
router.register(r'menu', MenuViewSet)
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
