import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpinnerService } from './spinner.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private spinner: SpinnerService) {}

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
      },() => {
        this.spinner.hide();
      })
    );
  }
}