import { createAction, props } from "@ngrx/store";
import { PagedResponse, Product, ProductRequest, ProductsQuery } from "../../shared/models/product.interface";

export const createProduct = createAction(
  '[Products] Create Product',
  props<{ product: ProductRequest }>()
);
export const createProductSuccess = createAction(
  '[Products] Create Product Success',
  props<{ product: Product }>()
);
export const createProductFailure = createAction(
  '[Products] Create Product Failure',
  props<{ error: any }>()
);

export const getProducts = createAction('[Products] Get Products', props<{ query: ProductsQuery }>());
export const getProductsSuccess = createAction(
  '[Products] Get Products Success',
  props<{ response: PagedResponse<Product> }>()
);
export const getProductsFailure = createAction(
  '[Products] Get Products Failure',
  props<{ error: any }>()
);

export const getProductById = createAction(
  '[Products] Get Product By Id',
  props<{ id: number }>()
);
export const getProductByIdSuccess = createAction(
  '[Products] Get Product By Id Success',
  props<{ product: Product }>()
);
export const getProductByIdFailure = createAction(
  '[Products] Get Product By Id Failure',
  props<{ error: any }>()
);

export const updateProduct = createAction(
  '[Products] Update Product',
  props<{ id: number; product: ProductRequest }>()
);
export const updateProductSuccess = createAction(
  '[Products] Update Product Success',
  props<{ product: Product }>()
);
export const updateProductFailure = createAction(
  '[Products] Update Product Failure',
  props<{ error: any }>()
);

export const deleteProduct = createAction(
  '[Products] Delete Product',
  props<{ id: number }>()
);
export const deleteProductSuccess = createAction(
  '[Products] Delete Product Success',
  props<{ id: number }>()
);
export const deleteProductFailure = createAction(
  '[Products] Delete Product Failure',
  props<{ error: any }>()
);
