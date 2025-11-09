from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.apps import apps
from .models import AuditLog
from .middleware import get_current_user


# List of models you want to track
TRACKED_MODELS = [
    'Category',
    'Product',
    'Supplier',
    'Customer',
    'PurchaseOrder',
    'PurchaseItem',
    'SalesOrder',
    'SalesItem',
    'StockMovement',
]


def log_action(user, instance, action):
    """Helper function to create an AuditLog entry."""
    AuditLog.objects.create(
        user=user,
        action=action,
        description=f"{user.username} {action.lower()} {instance.__class__.__name__} '{instance}'"
    )


@receiver(post_save)
def log_save(sender, instance, created, **kwargs):
    # Only log if the model is in the tracked list
    if sender.__name__ not in TRACKED_MODELS:
        return

    user = get_current_user()
    if not user or not user.is_authenticated:
        return

    action = "Created" if created else "Updated"
    log_action(user, instance, action)


@receiver(post_delete)
def log_delete(sender, instance, **kwargs):
    if sender.__name__ not in TRACKED_MODELS:
        return

    user = get_current_user()
    if not user or not user.is_authenticated:
        return

    log_action(user, instance, "Deleted")

