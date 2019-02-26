import { Component, OnInit } from '@angular/core';
//import { first } from 'rxjs/operators';

import { User, Exam, Patient } from '../_models';
import { DataService } from '../_services';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    currentUser: User;
    selectedExam: Exam;
    usersExams: Exam[];

    constructor(private dataService: DataService) { }

    ngOnInit() { }

    printUser() {
        console.log(this.dataService.getCurrentUser());
    }

    printExams() {
        console.log(this.dataService.getAllExams());
    }

    printExam() {
        console.log(this.dataService.getSelectedExam());
    }

    newExam() {
        this.dataService.newExam();
    }

    private loadAllExams() {
        //this.usersExams = this.dataService.getAllExams();
    }

}
