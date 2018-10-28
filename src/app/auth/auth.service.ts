import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';

@Injectable()
export class AuthService {
    token: string;

    constructor(private router: Router,
        private httpClient: HttpClient) {}

    isAuthenticated() {
        return this.token != null;
    }

    logout() {
        //firebase.auth().signOut();
        this.token = null;
    }

    login(username: string, password: string) {
        // firebase.auth().createUserWithEmailAndPassword(email, password)
        //     .then(response => {})
        //     .catch(error => console.log(error));
    }

    register(username: string, email: string, password: string) {
        const req = new HttpRequest('POST', '/users/register',
            {username, email, password});
        
        return this.httpClient.request(req).subscribe(
            (response) => {
                console.log(response);
            },
            (error) => console.log(error)
        );;

        //By calling this method the user token will be automatically stored 
        //on client side by firebase SDK in localStorage or IndexDB. 
        //So that we don't need to store this token manually.
        // firebase.auth().signInWithEmailAndPassword(email, password)
        //     .then(response => {
        //         this.router.navigate(['/']);
        //         firebase.auth().currentUser.getIdToken()
        //             .then((token: string)=> this.token = token)
        //     })
        //     .catch(error => console.log(error));
    }

    getToken() {
        // firebase.auth().currentUser.getIdToken()
        //     .then((token: string) => this.token = token);
        // return this.token;
    }
}
