import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Router } from "@angular/router";
import { User, Exam, Patient } from '../../_models/';
import { UserService } from '../user/user.service';
import { ExamService } from '../exam/exam.service';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private userService: UserService, 
      private examService: ExamService, 
      private http: Http
      ) { }

  getPatient(id: string) {
    //console.log("asking for: ", id);
    return this.http.get(API_URL + '/patient/' + id);
  }

  getMyPatientList() {
    this.examService.getMyExamList().subscribe( data => {
      var ex_list = JSON.parse((<any>data)._body);
      console.log(ex_list);
    })
  }
}
