import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, ProductRequest, ProductsQuery } from '../../shared/models/product.interface';
import { ProductsService } from '../../services/products.service';
import { ProductForm } from './product-form/product-form';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule, ProductForm],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  protected readonly query = signal('');
  protected readonly sort = signal<'name' | 'price'>('price');
  protected readonly direction = signal<'asc' | 'desc'>('asc');
  protected readonly pageNumber = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly editing = signal<Product | null>(null);
  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly totalCount = signal(0);
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.pageSize())));
  protected readonly pageStart = computed(() => this.totalCount() ? (this.pageNumber() - 1) * this.pageSize() + 1 : 0);
  protected readonly pageEnd = computed(() => Math.min(this.pageNumber() * this.pageSize(), this.totalCount()));

  constructor(private readonly productsService: ProductsService) {
    this.loadProducts();
  }

  protected reload() { this.loadProducts(); }

  protected updateFilters() {
    this.pageNumber.set(1);
    this.loadProducts();
  }

  protected goToPage(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > this.totalPages() || pageNumber === this.pageNumber()) return;
    this.pageNumber.set(pageNumber);
    this.loadProducts();
  }

  protected startAdd() { this.editing.set(null); }
  protected edit(product: Product) { this.editing.set(product); }

  protected save(product: ProductRequest) {
    const editing = this.editing();

    if (editing) {
      this.productsService.updateProduct(editing.id, product).subscribe({
        next: () => this.loadProducts(),
        error: () => this.error.set('Unable to save the product.'),
      });
    } else {
      this.productsService.createProduct(product).subscribe({
        next: () => this.loadProducts(),
        error: () => this.error.set('Unable to save the product.'),
      });
    }

    this.startAdd();
  }

  protected remove() {
    const product = this.editing();
    if (product) {
      this.productsService.deleteProduct(product.id).subscribe({
        next: () => {
          const remainingCount = Math.max(0, this.totalCount() - 1);
          const lastPage = Math.max(1, Math.ceil(remainingCount / this.pageSize()));
          this.pageNumber.update((page) => Math.min(page, lastPage));
          this.loadProducts();
        },
        error: () => this.error.set('Unable to delete the product.'),
      });
    }

    this.startAdd();
  }

  private loadProducts() {
    this.loading.set(true);
    this.error.set(null);

    const query: ProductsQuery = {
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
      search: this.query().trim() || undefined,
      sortBy: this.sort(),
      sortDirection: this.direction(),
    };

    this.productsService.getProducts(query).subscribe({
      next: (response) => {
        this.products.set(response.items);
        this.totalCount.set(response.totalCount);
        this.loading.set(false);
      },
      error: () => {
        this.products.set([]);
        this.totalCount.set(0);
        this.error.set('Unable to load products.');
        this.loading.set(false);
      },
    });
  }
}
