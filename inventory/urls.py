# backend/inventory/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views_auth import RegisterView, CurrentUserView
from .views import (
    CategoryViewSet, ProductViewSet, SupplierViewSet, CustomerViewSet,
    PurchaseOrderViewSet, PurchaseItemViewSet,
    SalesOrderViewSet, SalesItemViewSet,
    StockMovementViewSet, AuditLogViewSet
)

# JWT and auth routes
auth_patterns = [
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/register/", RegisterView.as_view(), name="auth_register"),
    path("auth/me/", CurrentUserView.as_view(), name="auth_me"),
]

# DRF router for viewsets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'purchase-orders', PurchaseOrderViewSet)
router.register(r'purchase-items', PurchaseItemViewSet)
router.register(r'sales-orders', SalesOrderViewSet)
router.register(r'sales-items', SalesItemViewSet)
router.register(r'stock-movements', StockMovementViewSet)
router.register(r'audit-logs', AuditLogViewSet)

# Combine both auth and router URLs
urlpatterns = [
    # Include JWT/auth routes
    *auth_patterns,
    # Include router routes
    path('', include(router.urls)),
]
