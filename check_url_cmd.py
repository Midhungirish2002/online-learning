from django.urls import resolve
try:
    print("Attempting to resolve...")
    r = resolve('/api/admin-api/export-results/')
    print(f"RESOLVED: {r.view_name}")
except Exception as e:
    print(f"FAILED: {e}")
