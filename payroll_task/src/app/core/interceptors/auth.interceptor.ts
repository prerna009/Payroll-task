import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService);
  const token = sessionStorage.getItem('authToken');
  if(token){
    req = req.clone({
      setHeaders: {
        Authorization: `Basic ${token}`
      }
    });
  } 

  return next(req).pipe(
    catchError((err: any) => {
      if (err.error) {
        const errMessage = err.error.Message ? err.error.Message : 'Something went wrong';
        toastrService.error(errMessage);
      }
      return throwError(() => new Error(err));
    })
  );
};
