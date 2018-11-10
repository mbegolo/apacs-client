import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User, Exam, Patient } from '../_models';


@Injectable()
export class ExamService {
    actualUser: User;
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
    getAllExams(user_id: string) {
        var url = "https://web.math.unipd.it/apacs/esames?user="+user_id;
        console.log("LOAD FROM BACKEND");
        this.http.get(url).subscribe(data => {
            var rawData = data as any[];
            for (var i=0; i<rawData.length; i++) {
                var tmp = new Exam;
                tmp = rawData[i];
                this.usersExams.push(tmp);
            }
            this.transformDate();
            localStorage.setItem('usersExams', JSON.stringify(this.usersExams));
            console.log("exam service: ", this.usersExams[0]["anagrafica"].data);
            return this.usersExams;
        });
        return this.usersExams;
    }

    getExamById(id: string) {
        console.log("call - getExamById (examservice.ts)");
        console.log("LOAD FROM BACKEND");
        var url = "https://web.math.unipd.it/apacs/esames?id="+id;
        return this.http.get<any[]>(url).subscribe(data => {
            console.log("get exam by id");
        });
    }

    addExam(exam: Exam) {
        // TODO
        console.log("TODO");
        return false;
    }

    saveExam(exam: Exam) {
        var savep = this.saveAnagrafica(exam["anagrafica"] as Patient);
        if (!savep) return false;
        var id = exam.id;
        return this.http.put(`https://web.math.unipd.it/apacs/esames/${id}`, exam).subscribe(
            response => {
                var res = response as Exam;
                console.log('Exam saved: ', res.id, `(${res.nome})`);
                //return this.saveAnagrafica(res.anagrafica);
            },
            error => {
                console.log("SAVE exam FAILED");
                return false
            }
        );
    }

    saveAnagrafica(p: Patient) {
        var id = p.id;
        return this.http.put(`https://web.math.unipd.it/apacs/anagraficas/${id}`, p).subscribe(
            response => {
                // Handle success.
                console.log(p);
                console.log('Patient saved - ', (response as Patient));
                return true;
            },
            error => {
                console.log("SAVE patient FAILED");
                console.error(error);
                return false
            }
        );
    }

    newAnagrafica(p: Patient) {
        var id = p.id;
        this.http.post(`https://web.math.unipd.it/apacs/anagraficas/`, p).subscribe(
            response => {
                // Handle success.
                console.log('Patient created - ', (response as Patient));
                return response;
            },
            error => {
                console.log("CREATE patient FAILED");
                console.log(error);
                return error
            }
        );
    }

    newExam(exam: Exam) {
        this.http.post(`https://web.math.unipd.it/apacs/esames/`, exam).subscribe(
            response => {
                console.log('Exam created - ', (response as Exam));
                var pat = new Patient();
                pat.esame = response["esame"]["id"];
                var newAnag = this.newAnagrafica(pat);
                exam.anagrafica = newAnag["id"];
                this.saveExam(exam);
                return true;
            },
            error => {
                console.log("CREATE exam FAILED");
                console.error(error);
                return false
            }
        );
    }

    private transformDate() {
        for (var i in this.usersExams) {
            var date = new Date(this.usersExams[i]["createdAt"]);
            var ita_date = date.getUTCDate() + "/" + (date.getUTCMonth() + 1) + "/" + date.getUTCFullYear();
            this.usersExams[i]["createdAt"] = ita_date;
            this.usersExams[i]["anagrafica"].data = date.getUTCFullYear() +"-"+ (date.getUTCMonth() + 1)  +"-"+ date.getUTCDate();
        }
    }

}