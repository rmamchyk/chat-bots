import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { User } from '../shared/models/User';

@Injectable()
export class AuthService {
    constructor(private router: Router,
        private http: HttpClient) {}

    isAuthenticated(): boolean {
        return !!localStorage.getItem('currentUser');
    }

    getCurrentUser(): User {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    logout() {
        return this.http.delete('/users/logout').subscribe(
            res => {
                // remove user from local storage to log user out
                localStorage.removeItem('currentUser');
                this.router.navigate(['/login']);
            },
            (err) => console.log(err));
    }

    login(username: string, password: string) {
        return this.http.post<any>('/users/login', {username, password})
            .pipe(map(res => {
                // login successful if there's a jwt token in the response
                if (res.user && res.user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(res.user));
                    this.router.navigate(['/']);
                }
                return res;
            }));
    }

    register(username: string, email: string, password: string) {
        return this.http.post<any>('/users/register', {username, email, password})
            .pipe(map(res => {
                // login successful if there's a jwt token in the response
                if (res && res.user && res.user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(res.user));
                    this.router.navigate(['/']);
                }
                return res;
            }));
    }
}
