from fastapi import APIRouter, HTTPException
from backend.schema.product import Product, ProductCreate
from backend.services import product_service 

router = APIRouter()

@router.post("/products/", response_model=Product)

def create_product(product: ProductCreate):
    try:
        return product_service.create_product(product)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/products/", response_model=list[Product])
def list_products():
    return product_service.list_products()

@router.get("/products/{product_id}", response_model=Product)
def get_product(product_id: str):
    try:
        return product_service.get_product(product_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/products/{product_id}", response_model=Product)
def update_product(product_id: str, product: ProductCreate):
    try:
        return product_service.update_product(product_id, product)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/products/{product_id}")
def delete_product(product_id: str):
    try:
        return product_service.delete_product(product_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
