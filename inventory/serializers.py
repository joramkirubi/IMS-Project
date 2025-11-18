
from rest_framework import serializers
from .models import (
    Category, Product, Supplier, Customer,
    PurchaseOrder, PurchaseItem,
    SalesOrder, SalesItem,
    StockMovement, AuditLog
)


# ===============================
# CATEGORY
# ===============================
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


# ===============================
# PRODUCT
# ===============================
class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Product
        fields = "__all__"


# ===============================
# SUPPLIER
# ===============================
class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = "__all__"


# ===============================
# CUSTOMER
# ===============================
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


# ===============================
# PURCHASE ORDER
# ===============================
class PurchaseOrderSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source="supplier.name", read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = "__all__"


# ===============================
# PURCHASE ITEM
# ===============================
class PurchaseItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    purchase_order_display = serializers.CharField(source="purchase_order.__str__", read_only=True)

    class Meta:
        model = PurchaseItem
        fields = "__all__"
# ==============================
# SALES ITEM
# ==============================

class SalesItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    sales_order_display = serializers.SerializerMethodField()

    class Meta:
        model = SalesItem
        fields = "__all__"

    def get_sales_order_display(self, obj):
        return f"SO-{obj.sales_order.id}" if obj.sales_order else "N/A"



class SalesOrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    processed_by_name = serializers.CharField(source="processed_by.username", read_only=True, allow_null=True)

    class Meta:
        model = SalesOrder
        fields = "__all__"

    def get_customer_name(self, obj):
        if obj.customer:
            return getattr(obj.customer, "name", "N/A")
        return "N/A"


# ===============================
# STOCK MOVEMENT
# ===============================
class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = StockMovement
        fields = "__all__"

# ===============================
# AUDIT LOG
# ===============================
class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True, allow_null=True)

    class Meta:
        model = AuditLog
        fields = "__all__"

