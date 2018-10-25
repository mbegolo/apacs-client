import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>("");
    }

    getById(id: number) {
        return this.http.get("https://web.math.unipd.it/apacs/auth/local/" + id);
    }

    register(user: User) {
        alert(""+user);
        return this.http.post('https://web.math.unipd.it/apacs/auth/local/register', user);
    }

    update(user: User) {
        return this.http.put("" + user.id, user);
    }

    delete(id: number) {
        return this.http.delete("" + id);
    }
}