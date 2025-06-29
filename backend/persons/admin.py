from django.contrib import admin
from .models import Person


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    """
    Admin configuration for Person model.
    """
    # Display fields in the list view
    list_display = ('id', 'first_name', 'last_name', 'created_at', 'updated_at')
    
    # Add search functionality
    search_fields = ('first_name', 'last_name')
    
    # Add filtering options
    list_filter = ('created_at', 'updated_at')
    
    # Fields to display in the detail view
    fields = ('first_name', 'last_name', 'created_at', 'updated_at')
    
    # Make timestamp fields read-only
    readonly_fields = ('created_at', 'updated_at')
    
    # Default ordering
    ordering = ('last_name', 'first_name')
    
    # Number of items per page
    list_per_page = 25
    
    # Enable date hierarchy navigation
    date_hierarchy = 'created_at'
