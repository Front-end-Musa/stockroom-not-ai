import { Component } from '@angular/core';
import { Products } from './features/products/products';

@Component({
  selector: 'app-root',
  imports: [Products],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
