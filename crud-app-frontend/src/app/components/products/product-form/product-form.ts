import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, ProductRequest } from '../../../shared/models/product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  readonly product = input<Product | null>(null);
  readonly saveProduct = output<ProductRequest>();
  readonly deleteProduct = output<void>();
  protected readonly isEdit = computed(() => this.product() !== null);
  protected readonly form = signal<ProductRequest>(this.emptyProduct());

  constructor() {
    effect(() => {
      const product = this.product();

      this.form.set(product
        ? {
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
          }
        : this.emptyProduct());
    });
  }

  protected submit() {
    const product = this.form();

    if (product.name.trim()) {
      this.saveProduct.emit(product);
    }
  }

  private emptyProduct(): ProductRequest {
    return { name: '', description: '', price: 0, quantity: 0 };
  }
}
