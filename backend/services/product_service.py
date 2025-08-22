from backend.schema.product import Product, ProductCreate
from backend.services.supabase_client import supabase

def create_product(product: ProductCreate) -> Product:
    response = supabase.table("products").insert(product.dict()).execute()
    if not response.data:
        raise ValueError("Error creating product")
    return response.data[0]

def list_products() -> list[Product]:
    response = supabase.table("products").select("*").execute()
    return response.data

def get_product(product_id: str) -> Product:
    response = supabase.table("products").select("*").eq("id", product_id).execute()
    if not response.data:
        raise ValueError("Product not found")
    return response.data[0]

def update_product(product_id: str, product: ProductCreate) -> Product:
    response = supabase.table("products").update(product.dict()).eq("id", product_id).execute()
    if not response.data:
        raise ValueError("Product not found")
    return response.data[0]

def delete_product(product_id: str) -> dict:
    response = supabase.table("products").delete().eq("id", product_id).execute()
    if not response.data:
        raise ValueError("Product not found")
    return {"message": "Product deleted successfully"}
