import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: UserService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('api/upload')||req.url.includes('api/images') ||req.url.includes('api/auth/sigup') || req.url.includes('api/auth/signin')||req.url.includes("api/users/**")||req.url.includes("api")) {
      // Skip adding the token for login and signup requests
      return next.handle(req);
    }

    const token = this.authService.getToken();
    // Set the Authorization header with the access token
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("token : "+token)
    // Proceed with the modified request
    return next.handle(authReq);
   }
}
