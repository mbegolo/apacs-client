import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService } from '../_services';


@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    exams;

    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        var localUsrData = JSON.parse(localStorage.getItem('currentUser'));
        this.currentUser.id = localUsrData["user"]["_id"];
        this.currentUser.username = localUsrData["user"]["username"];
        this.currentUser.email = localUsrData["user"]["email"];
        this.currentUser.token = localUsrData["jwt"];
        console.log("User logged in: "+JSON.stringify(this.currentUser.username));
    }

    ngOnInit() {
        this.exams = this.loadAllExams();
    }

    print() {
        console.log(this.exams);
    }

    private loadAllExams() {
        var out = this.userService.getAllExams(this.currentUser.id).subscribe(data => {
            this.exams = data;
            this.transformDate();
            return data
        });
        this.print();
    }

    private transformDate() {
        for (var i in this.exams) {
            var date = new Date(this.exams[i]["createdAt"]);
            var ita_date = date.getUTCDate() + "/" + (date.getUTCMonth() + 1) + "/" + date.getUTCFullYear();
            this.exams[i]["createdAt"] = ita_date;
        }
    }

}