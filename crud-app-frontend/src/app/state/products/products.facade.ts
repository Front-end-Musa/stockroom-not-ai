import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Product, ProductRequest, ProductsQuery } from "../../shared/models/product.interface";
import { Observable } from "rxjs/internal/Observable";
import { selectProducts, selectProductsLoading, selectProductsError, selectProductsStatus, selectProductsTotalCount, selectSelectedProduct } from "./products.selectors";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "./products.actions";

@Injectable({
    providedIn: "root",
})
export class ProductsFacade {
    store: Store;
    selectProducts$: Observable<Product[]>;
    selectProductsLoading$: Observable<boolean>;
    selectProductsError$: Observable<any>;
    selectProductsStatus$: Observable<string>;
    selectSelectedProduct$: Observable<Product | null>;
    selectProductsTotalCount$: Observable<number>;
    
    constructor(store: Store) {
        this.store = store;
        this.selectProducts$ = this.store.select(selectProducts);
        this.selectProductsLoading$ = this.store.select(selectProductsLoading);
        this.selectProductsError$ = this.store.select(selectProductsError);
        this.selectProductsStatus$ = this.store.select(selectProductsStatus);
        this.selectSelectedProduct$ = this.store.select(selectSelectedProduct);
        this.selectProductsTotalCount$ = this.store.select(selectProductsTotalCount);
    }
    
    createProduct(product: ProductRequest): void {
        this.store.dispatch(createProduct({ product }));
    }

    getProducts(query: ProductsQuery): void {
        this.store.dispatch(getProducts({ query }));
    }

    getProductById(id: number): void {
        this.store.dispatch(getProductById({ id }));
    }

    updateProduct(id: number, product: ProductRequest): void {
        this.store.dispatch(updateProduct({ id, product }));
    }

    deleteProduct(id: number): void {
        this.store.dispatch(deleteProduct({ id }));
    }
}
