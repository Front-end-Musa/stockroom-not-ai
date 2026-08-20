import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environment/environment';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/api/')) {
    req = req.clone({
      url: `${environment.apiUrl}${req.url}`
    });
  }

  return next(req);
};
