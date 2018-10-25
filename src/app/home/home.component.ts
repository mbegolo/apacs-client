import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService } from '../_services';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];

    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        var localUsrData = JSON.parse(localStorage.getItem('currentUser'));
        this.currentUser.id = localUsrData["user"]["_id"];
        this.currentUser.username = localUsrData["user"]["username"];
        this.currentUser.email = localUsrData["user"]["email"];
        this.currentUser.token = localUsrData["jwt"];
        alert(JSON.stringify(this.currentUser.username));
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    deleteUser(id: number) {
        this.userService.delete(id).pipe(first()).subscribe(() => { 
            this.loadAllUsers() 
        });
    }

    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => { 
            this.users = users; 
        });
    }
}