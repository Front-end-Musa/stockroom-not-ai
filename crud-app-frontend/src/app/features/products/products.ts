import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product, ProductRequest, ProductsQuery } from '../../shared/models/product.interface';
import { ProductsFacade } from '../../state/products/products.facade';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, DatePipe, FormsModule],
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
  protected readonly products: Signal<Product[]>;
  protected readonly loading: Signal<boolean>;
  protected readonly error: Signal<string | null>;
  protected readonly totalCount: Signal<number>;
  protected readonly form = signal<ProductRequest>(this.emptyProduct());
  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalCount() / this.pageSize())),
  );
  protected readonly pageStart = computed(() =>
    this.totalCount() ? (this.pageNumber() - 1) * this.pageSize() + 1 : 0,
  );
  protected readonly pageEnd = computed(() =>
    Math.min(this.pageNumber() * this.pageSize(), this.totalCount()),
  );

  constructor(private productsFacade: ProductsFacade) {
    this.products = toSignal(this.productsFacade.selectProducts$, { initialValue: [] });
    this.loading = toSignal(this.productsFacade.selectProductsLoading$, { initialValue: false });
    this.error = toSignal(this.productsFacade.selectProductsError$, { initialValue: null });
    this.totalCount = toSignal(this.productsFacade.selectProductsTotalCount$, { initialValue: 0 });
    this.loadProducts();
  }

  protected reload() {
    this.loadProducts();
  }

  protected updateFilters() {
    console.log(this.query(), this.sort());
    this.pageNumber.set(1);
    this.loadProducts();
  }

  protected goToPage(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > this.totalPages() || pageNumber === this.pageNumber()) {
      return;
    }

    this.pageNumber.set(pageNumber);
    this.loadProducts();
  }

  protected startAdd() {
    this.editing.set(null);
    this.form.set(this.emptyProduct());
  }

  protected edit(product: Product) {
    this.editing.set(product);
    this.form.set({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
    });
  }

  protected save() {
    const product = this.form();

    if (!product.name.trim()) {
      return;
    }

    if (this.editing()) {
      this.productsFacade.updateProduct(this.editing()!.id, product);
    } else {
      this.productsFacade.createProduct(product);
    }

    this.startAdd();
  }

  protected remove() {
    const product = this.editing();

    if (product) {
      this.productsFacade.deleteProduct(product.id);
    }

    this.startAdd();
  }

  private loadProducts() {
    this.productsFacade.getProducts({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
      search: this.query().trim() || undefined,
      sortBy: this.sort(),
      sortDirection: this.direction(),
    });
  }

  private emptyProduct(): ProductRequest {
    return {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
    };
  }
}
