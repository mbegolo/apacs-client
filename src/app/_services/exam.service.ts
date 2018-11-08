import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';
import { Exam } from '../_models';


@Injectable()
export class ExamService {
    actualUser: User;
    actualExam: Exam;
    usersExams: Exam[];

    constructor(private http: HttpClient) {
        this.usersExams = [];
    }

/*
    getAllExams(id: string) {
        var url = "https://web.math.unipd.it/apacs/esames?user="+id;
        return this.http.get(url);
    }
    */
    getAllExams(id: string) {
        var url = "https://web.math.unipd.it/apacs/esames?user="+id;
        this.http.get(url).subscribe(data => {
            var rawData = data as any[];
            for (var i=0; i<rawData.length; i++) {
                var tmp = new Exam;
                tmp = rawData[i];
                this.usersExams.push(tmp);
            }
            this.transformDate();
            return this.usersExams;
        });
        return this.usersExams;
    }

    getExamById(id: string) {
        var url = "https://web.math.unipd.it/apacs/esames?id="+id;
        return this.http.get<any[]>(url).subscribe(data => {
            alert("get exam by id");
        });
    }

    addExam(exam: Exam) {
        // TODO
        console.log("TODO");
        return false;
    }

    saveExam(exam: Exam) {
        // TODO
        console.log("TODO");
        return false;
    }

/*
    getSelectedExam() {
        if (this.actualExam != null) return this.actualExam;
        return false;
    }

    getActualExam() {
        return this.getSelectedExam();
    }

    getPatientData() {
        if (this.actualExam != null) return this.actualExam['anagrafica'];
        return false;
    }
*/
    private transformDate() {
        for (var i in this.usersExams) {
            var date = new Date(this.usersExams[i]["createdAt"]);
            var ita_date = date.getUTCDate() + "/" + (date.getUTCMonth() + 1) + "/" + date.getUTCFullYear();
            this.usersExams[i]["createdAt"] = ita_date;
        }
    }

}