export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
}

export interface ProductRequest {
    name: string;
    description: string;
    price: number;
    quantity: number;
}

export interface ProductsQuery {
    pageNumber: number;
    pageSize: number;
    search?: string;
    sortBy?: 'name' | 'price';
    sortDirection?: 'asc' | 'desc';
}

export interface PagedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}
