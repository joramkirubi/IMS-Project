from django.contrib import admin
from .models import (
    Category, Product, Supplier, Customer,
    PurchaseOrder, PurchaseItem,
    SalesOrder, SalesItem,
    StockMovement, AuditLog
)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description")
    search_fields = ("name",)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "category", "sku", "quantity", "reorder_level", "selling_price")
    list_filter = ("category",)
    search_fields = ("name", "sku")

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "contact_person", "phone", "email")
    search_fields = ("name", "phone")

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "phone", "email")
    search_fields = ("name", "phone")

@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ("id", "supplier", "order_date", "status", "total_amount")
    list_filter = ("status",)

@admin.register(PurchaseItem)
class PurchaseItemAdmin(admin.ModelAdmin):
    list_display = ("id", "purchase_order", "product", "quantity", "cost_price")

@admin.register(SalesOrder)
class SalesOrderAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "order_date", "status", "total_amount", "processed_by")
    list_filter = ("status",)

@admin.register(SalesItem)
class SalesItemAdmin(admin.ModelAdmin):
    list_display = ("id", "sales_order", "product", "quantity", "selling_price")

@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ("id", "product", "movement_type", "quantity", "date", "reference")
    list_filter = ("movement_type",)

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "action", "timestamp")
    search_fields = ("action", "user__username")

