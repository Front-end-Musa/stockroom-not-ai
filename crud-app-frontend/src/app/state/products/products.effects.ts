import { Injectable } from "@angular/core";
import { Actions, CreateEffectMetadata, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { ProductsService } from "../../core/services/products.service";
import { createProduct, createProductFailure, createProductSuccess, getProducts, getProductsFailure, getProductsSuccess, updateProductSuccess, updateProductFailure, updateProduct, getProductById, getProductByIdFailure, getProductByIdSuccess, deleteProductFailure, deleteProductSuccess, deleteProduct } from "./products.actions";
import { map } from "rxjs";
import { catchError } from "rxjs";
import { mergeMap } from "rxjs";
import { switchMap } from "rxjs";
import { of } from "rxjs";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class ProductsEffects {
    createProduct$: Observable<Action> & CreateEffectMetadata;
    getProducts$: Observable<Action> & CreateEffectMetadata;
    getProductById$: Observable<Action> & CreateEffectMetadata;
    updateProduct$: Observable<Action> & CreateEffectMetadata;
    deleteProduct$: Observable<Action> & CreateEffectMetadata;

    constructor(
        private readonly actions$: Actions,
        private readonly productsService: ProductsService
    ) {
        this.createProduct$ = createEffect(() =>
            this.actions$.pipe(
                ofType(createProduct),
                mergeMap((action) =>
                    this.productsService.createProduct(action.product).pipe(
                        map((product) => createProductSuccess({ product })),
                        catchError((error) => of(createProductFailure({ error })))
                    )
                )
            )
        );

        this.getProducts$ = createEffect(() =>
            this.actions$.pipe(
                ofType(getProducts),
                switchMap((action) =>
                    this.productsService.getProducts(action.query).pipe(
                        map((response) => getProductsSuccess({ response })),
                        catchError((error) => of(getProductsFailure({ error })))
                    )
                )
            )
        );

        this.getProductById$ = createEffect(() =>
            this.actions$.pipe(
                ofType(getProductById),
                mergeMap((action) =>
                    this.productsService.getProductById(action.id).pipe(
                        map((product) => getProductByIdSuccess({ product })),
                        catchError((error) => of(getProductByIdFailure({ error })))
                    )
                )
            )
        );

        this.updateProduct$ = createEffect(() =>
            this.actions$.pipe(
                ofType(updateProduct),
                mergeMap((action) =>
                    this.productsService.updateProduct(action.id, action.product).pipe(
                        map((product) => updateProductSuccess({ product })),
                        catchError((error) => of(updateProductFailure({ error })))
                    )
                )
            )
        );

        this.deleteProduct$ = createEffect(() =>
            this.actions$.pipe(
                ofType(deleteProduct),
                mergeMap((action) =>
                    this.productsService.deleteProduct(action.id).pipe(
                        map(() => deleteProductSuccess({ id: action.id })),
                        catchError((error) => of(deleteProductFailure({ error })))
                    )
                )
            )
        );
    }
}
