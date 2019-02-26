import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post<any>('https://web.math.unipd.it/apacs/auth/local', { identifier: username, password: password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                console.log(JSON.stringify(user));
                user.token = user["jwt"];
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('selectedExam');
        localStorage.removeItem('usersExams');
    }
}