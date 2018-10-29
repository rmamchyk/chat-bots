import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let currentUser = this.authService.getCurrentUser();
        const copiedReq = req.clone({
            setHeaders: { 
                'x-auth': currentUser ? currentUser.token : ''
            }
        });
        return next.handle(copiedReq); //lets the request to continue its journey
    }
}