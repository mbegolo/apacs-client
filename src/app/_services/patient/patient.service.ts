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

  public activePatient: Patient;
  public activePatientId: string;

  constructor(private userService: UserService, 
      private examService: ExamService, 
      private http: Http
      ) { }

  getPatient(id: string) {
    //console.log("asking for: ", id);
    return this.http.get(API_URL + '/patient/' + id);
  }

  setActive(pid: string) {
    this.activePatientId = pid;
    this.getPatient(pid).subscribe(response => {
      this.activePatient = JSON.parse((<any>response)._body) as Patient;
      this.saveOnLocal(this.activePatient);
      //console.log("PAT service: ",this.activePatient);
    },
    error => {
      console.log(error);
    });
  }

  saveOnLocal(p: Patient) {
    this.activePatient = p;
    localStorage.setItem('activePatient',JSON.stringify(this.activePatient));
    this.loadFromLocal();
  }

  loadFromLocal() {
    var patient = JSON.parse(localStorage.getItem('activePatient'));
    this.activePatient = patient;
    return this.activePatient;
  }

  getActivePatient(): Patient {
    this.loadFromLocal();
    return this.activePatient;
  }

  createNewPatient() {
    var new_pat = new Patient();
    return this.http.post(API_URL + '/patient', new_pat);
  }

  getMyPatientList() {
    this.examService.getMyExamList().subscribe( data => {
      var ex_list = JSON.parse((<any>data)._body);
      console.log(ex_list);
    })
  }

  savePatient(p: Patient) {
    return this.http.post(API_URL + '/patient/' + p.id, p);
  }

  deletePatient(pid: string) {
    return this.http.delete(API_URL + '/patient/' + pid);
  }
}
