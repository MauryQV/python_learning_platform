from supabase import create_client, Client
from backend.core.config import settings

# Supabase client
supabase: Client = create_client(
    settings.SUPABASE_URL, 
    settings.SUPABASE_KEY
)



