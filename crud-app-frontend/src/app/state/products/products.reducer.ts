import { Product } from "../../shared/models/product.interface";
import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createProduct, createProductFailure, createProductSuccess, deleteProduct, deleteProductFailure, deleteProductSuccess, getProductById, getProductByIdFailure, getProductByIdSuccess, getProducts, getProductsFailure, getProductsSuccess, updateProduct, updateProductFailure, updateProductSuccess } from "./products.actions";
import { createReducer, on } from "@ngrx/store";
import { ProductsQuery } from "../../shared/models/product.interface";

export interface ProductsState extends EntityState<Product> {
    products: Product[];
    selectedProduct: Product | null;
    status: 'init' | 'loading' | 'success' | 'error';
    loading: boolean;
    error: any;
    totalCount: number;
    query: ProductsQuery;
}

export const productsEntityAdapter = createEntityAdapter<Product>({
    selectId: (product: Product) => product.id,
});

export const initialProductsState: ProductsState = productsEntityAdapter.getInitialState({
    products: [],
    selectedProduct: null,
    status: 'init',
    loading: false,
    error: null,
    totalCount: 0,
    query: { pageNumber: 1, pageSize: 10 },
});

export const productsReducer = createReducer(
    initialProductsState,
    on(createProduct, (state) => ({
        ...state,
        status: 'loading',
        loading: true,
        error: null,
    })),
    on(createProductSuccess, (state) => ({
        ...state,
        status: 'success',
        loading: false,
        error: null,
    })),
    on(createProductFailure, (state, { error }) => ({
        ...state,
        status: 'error',
        loading: false,
        error: error,
    })),

    on(getProducts, (state, { query }) => ({
        ...state,
        query,
        status: 'loading',
        loading: true,
        error: null,
    })),
    on(getProductsSuccess, (state, { response }) => productsEntityAdapter.setAll(response.items, {
        ...state,
        totalCount: response.totalCount,
        query: { ...state.query, pageNumber: response.pageNumber, pageSize: response.pageSize },
        status: 'success',
        loading: false,
        error: null,
    })),
    on(getProductsFailure, (state, { error }) => ({
        ...state,
        status: 'error',
        loading: false,
        error: error,
    })),

    on(getProductById, (state) => ({
        ...state,
        status: 'loading',
        loading: true,
        error: null,
    })),
    on(getProductByIdSuccess, (state, { product }) => productsEntityAdapter.upsertOne(product, {
        ...state,
        selectedProduct: product,
        status: 'success',
        loading: false,
        error: null,
    })),
    on(getProductByIdFailure, (state, { error }) => ({
        ...state,
        status: 'error',
        loading: false,
        error: error,
    })),

    on(updateProduct, (state) => ({
        ...state,
        status: 'loading',
        loading: true,
        error: null,
    })),
    on(updateProductSuccess, (state) => ({
        ...state,
        status: 'success',
        loading: false,
        error: null,
    })),
    on(updateProductFailure, (state, { error }) => ({
        ...state,
        status: 'error',
        loading: false,
        error: error,
    })),

    on(deleteProduct, (state) => ({
        ...state,
        status: 'loading',
        loading: true,
        error: null,
    })),
    on(deleteProductSuccess, (state) => ({
        ...state,
        status: 'success',
        loading: false,
        error: null,
    })),
    on(deleteProductFailure, (state, { error }) => ({
        ...state,
        status: 'error',
        loading: false,
        error: error,
    }))
);
