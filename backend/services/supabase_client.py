from typing import Optional, Dict, Any
from supabase import Client
from backend.core.database import supabase

class SupabaseService:
    def __init__(self):
        self.client = supabase
        
        
supabase_service = SupabaseService()