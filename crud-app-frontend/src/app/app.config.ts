import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiUrlInterceptor } from './core/interceptors/api-url.interceptor';
import { ProductsEffects } from './state/products/products.effects';
import { provideEffects } from '@ngrx/effects';
import { productsReducer } from './state/products/products.reducer';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(),
    provideHttpClient(
      withInterceptors([
        apiUrlInterceptor
      ])
    ),
    provideEffects([ProductsEffects]),
    provideStore({
      products: productsReducer
    }),
      provideStoreDevtools({ maxAge: 25, logOnly: false, autoPause: true })
  ]
};
