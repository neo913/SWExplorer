import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SpinnerService } from './spinner.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private spinner: SpinnerService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinner.show();
    request = request.clone({
      withCredentials: false
    });

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.spinner.hide();
          }
      }, (error) => {
        this.spinner.hide();
        if(error.status) {
          this.router.navigate(['/errors', error.status]);
        }
      },() => {
        this.spinner.hide();
      })
    );
  }
}