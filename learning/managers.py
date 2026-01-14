from django.db import models

class ActiveManager(models.Manager):
    """Default manager returning only is_active=True records."""
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)

class AllObjectsManager(models.Manager):
    """Manager returning all records (including inactive)."""
    pass