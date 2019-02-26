import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';
import { Exam } from '../_models';


@Injectable()
export class UserService {
    actualUser: User;
    actualExam: Exam;

    constructor(private http: HttpClient) { }

    getById(id: number) {
        return this.http.get("https://web.math.unipd.it/apacs/auth/local/" + id);
    }

    register(user: User) {
        alert("user.service.ts: \n"+user);
        return this.http.post('https://web.math.unipd.it/apacs/auth/local/register', user);
    }

    getActualUser() {
        /*
        if (this.actualUser!=null) return this.actualUser;
        return false;
        */
        return this.actualUser;
    }

    userLogged() {
        if (this.actualUser!=null) return true;
        return false;
    }

    update(user: User) {
        /* TODO
        return this.http.put("" + user.id, user);
        */
        console.log("TODO");
        return false
    }

    delete(id: number) {
        /* TODO
        return this.http.delete("" + id);
        */
        console.log("TODO");
        return false
    }
}