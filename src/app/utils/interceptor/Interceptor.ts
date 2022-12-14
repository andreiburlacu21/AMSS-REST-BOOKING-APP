import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, finalize, retry } from 'rxjs/operators';
import { AuthenticationService } from "src/app/services/authentication-service/authentication.service";
import { NotificationService } from "src/app/services/notification-service/notification.service";


@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService, private notifyService: NotificationService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Add Auth Token
    const Token = this.authService.getAccessToken();
    
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${Token}`
      }
    });

    return next.handle(req)
      .pipe(
        // Retry on failure
        retry(1),

        // Handle errors
        catchError((error: HttpErrorResponse) => {
          // Show errors as a toast 
          
          this.notifyService.showErrorNotification(error.error);

          return throwError(error);
        }),

        // PROFILING
        finalize(() => {
          const profilingMsg = `${req.method} "${req.urlWithParams}"`;
        })
      );
  }
}