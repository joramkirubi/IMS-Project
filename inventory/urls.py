from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, ProductViewSet, SupplierViewSet, CustomerViewSet,
    PurchaseOrderViewSet, PurchaseItemViewSet,
    SalesOrderViewSet, SalesItemViewSet,
    StockMovementViewSet, AuditLogViewSet
)

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

urlpatterns = router.urls

