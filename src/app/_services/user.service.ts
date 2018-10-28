import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getAllExams(id: string) {
        var url = "https://web.math.unipd.it/apacs/esames?user="+id;
        return this.http.get(url);
    }

    getById(id: number) {
        return this.http.get("https://web.math.unipd.it/apacs/auth/local/" + id);
    }

    register(user: User) {
        alert("user.service.ts: \n"+user);
        return this.http.post('https://web.math.unipd.it/apacs/auth/local/register', user);
    }

    update(user: User) {
        return this.http.put("" + user.id, user);
    }

    delete(id: number) {
        return this.http.delete("" + id);
    }
}