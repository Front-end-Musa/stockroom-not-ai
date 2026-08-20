import { createFeatureSelector, createSelector } from "@ngrx/store";
import { productsEntityAdapter, ProductsState } from "./products.reducer";

export const selectProductsState = createFeatureSelector<ProductsState>('products');

export const { selectAll } = productsEntityAdapter.getSelectors(selectProductsState);
export const selectProducts = selectAll;
export const selectProductsLoading = createSelector(
    selectProductsState,
    (state) => state.loading
);
export const selectProductsError = createSelector(
    selectProductsState,
    (state) => state.error
);
export const selectProductsStatus = createSelector(
    selectProductsState,
    (state) => state.status
);
export const selectSelectedProduct = createSelector(
    selectProductsState,
    (state) => state.selectedProduct
);
export const selectProductsTotalCount = createSelector(selectProductsState, (state) => state.totalCount);
