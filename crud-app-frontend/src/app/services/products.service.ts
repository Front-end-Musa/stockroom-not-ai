import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PagedResponse, Product, ProductRequest, ProductsQuery } from "../models/product.interface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
    constructor(private http: HttpClient) {}

    createProduct(product: ProductRequest): Observable<Product> {
        return this.http.post<Product>('/api/products', product);
    }

    getProducts(query: ProductsQuery): Observable<PagedResponse<Product>> {
        let params = new HttpParams().set('pageNumber', query.pageNumber).set('pageSize', query.pageSize);
        if (query.search) params = params.set('search', query.search);
        if (query.sortBy) params = params.set('sortBy', query.sortBy);
        if (query.sortDirection) params = params.set('sortDirection', query.sortDirection);
        return this.http.get<PagedResponse<Product>>('/api/products', { params });
    }

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`/api/products/${id}`);
    }

    updateProduct(id: number, product: ProductRequest): Observable<Product> {
        return this.http.put<Product>(`/api/products/${id}`, product);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`/api/products/${id}`);
    }

}
