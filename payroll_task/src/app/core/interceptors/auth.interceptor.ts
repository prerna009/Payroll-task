import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService);
  const token = localStorage.getItem('referraltoken');
  if(token){
    req = req.clone({
      url: `${environment.baseUrl}${req.url}`,
					setHeaders: {
						Authorization: `Bearer ${token}`
			}
    });
  } else {
    req = req.clone({
      url: `${environment.baseUrl}${req.url}`
    });
  }
  return next(req).pipe(
    tap((err: any) => {
      if(err.error){
        const errMessage = err.error.Message ? err.error.Message : 'Something went wrong';
        toastrService.error(errMessage);
      }
    })
  );
};
