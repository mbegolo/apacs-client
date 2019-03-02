import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Router } from "@angular/router";
import { User, Exam } from '../../_models/';
import { UserService } from '../user/user.service';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  public activeExam: Exam;
  public activeExamId: string;
  public allMyExams: Exam[];
  public lastExams: Exam[];
  public last_exams_number = 5;

  constructor(private userService: UserService, private http: Http) { }

  getMyExamList() {
    var usr_id = (this.userService.getLoggedUser() as User).id;
    return this.http.get(API_URL + '/exam/?user=' + usr_id);
  }

  getExam(id: string) {
    return this.http.get(API_URL + '/exam/'+id);
  }

  loadAllMyExams() {
    this.getMyExamList().subscribe(response => {
      var data = JSON.parse((<any>response)._body) as Exam[];
      this.allMyExams = data;
      this.lastExams = data.slice(data.length-this.last_exams_number);
    });
  }

  getAllMyExams() {
    return this.allMyExams;
  }

  getLastExams() {
    return this.lastExams;
  }

  createNewExam(pid:string) {
    var usr = this.userService.getLoggedUser();
    if (usr) {
      this.activeExam = new Exam(new Date(), usr.id, pid);
      return this.http.post(API_URL + '/exam', this.activeExam);
    }
  }

  setActive(id: string) {
    this.activeExamId = id;
    this.getExam(id).subscribe(data => {
      this.activeExam = JSON.parse((<any>data)._body) as Exam;
      this.saveOnLocal(this.activeExam);
      console.log("EXA service: ",this.activeExam);
    },
    error => console.log(error));
  }

  saveOnLocal(e: Exam) {
    this.activeExam = e;
    localStorage.setItem('activeExam',JSON.stringify(this.activeExam));
  }

  loadFromLocal() {
    var exam = JSON.parse(localStorage.getItem('activeExam'));
    this.activeExam = exam;
    return this.activeExam;
  }

  getActiveExam() {
    this.loadFromLocal();
    return this.activeExam;
  }

  deleteExam(id: string) {
    return this.http.delete(API_URL + '/exam/' + id);
  }

  saveExam(e: Exam) {
    return this.http.post(API_URL + '/exam/' + e.id , e)
  }

  update() {
    
  }
}
