import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Router } from "@angular/router";
import { User, Exam, ExamVoice } from '../../_models/';
import { UserService } from '../user/user.service';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  public activeExam: Exam;
  public activeExamId: string;
  public activeExamVoices: ExamVoice[] = [];
  public allMyExams: Exam[];
  public lastExams: Exam[];
  public last_exams_number = 5;

  constructor(private router:Router, 
    private userService: UserService, 
    private http: Http
  ) {
    var loc = this.loadFromLocal();
    if (loc != undefined)
      this.activeExamId = this.loadFromLocal().id;
  }

  refresh() {
    this.getMyExamList().subscribe(response => {
      this.allMyExams = JSON.parse((<any>response)._body);
    },
    errors => console.log(errors));
  }

  // Restituisce tutti gli esami di un dato utente
  getMyExamList() {
    var usr_id = "";
    if (this.userService.getLoggedUser() != undefined)
      usr_id = (this.userService.getLoggedUser() as User).id;
    return this.http.get(API_URL + '/exam/?user=' + usr_id);
  }

  // Restituisce un esame (dato il suo id)
  getExam(id: string) {
    return this.http.get(API_URL + '/exam/'+id);
  }

  getExamVoiceData(id: string) {
    return this.http.get(API_URL + '/examdata/' + id);
  }

  // Carica la lista dei miei esami su una variabile locale
  loadAllMyExams() {
    this.getMyExamList().subscribe(response => {
      var data = JSON.parse((<any>response)._body) as Exam[];
      this.allMyExams = data;
      this.lastExams = data.slice(data.length-this.last_exams_number);
    });
  }

  // restituisce tutti gli esami dalla variable locale
  getAllMyExams() {
    return this.allMyExams;
  }

  // restituisce gli ultimi esami (dalla variaible locale)
  getLastExams() {
    return this.lastExams;
  }

  // Crea un nuovo esame sul server
  createNewExam(pid:string) {
    var usr = this.userService.getLoggedUser();
    if (usr) {
      this.activeExam = new Exam(new Date(), usr.id, pid);
      return this.http.post(API_URL + '/exam', this.activeExam);
    }
  }

  // Crea una voce esame (dati) associata alla voce vid e all'esame eid
  createVoiceData(vid,eid) {
    var obj = {"m":true,"qv":false,"s":false,"punteggio":2,"progress":0,"voiceid":vid,"examid":eid};
    return this.http.post(API_URL + '/examdata',obj);
  }

  loadVoice(vid) {
    return this.http.get(API_URL + '/examvoice/' + vid);
  }

  // carica tutte le voci esame (info)
  loadAllVoices() {
    return this.http.get(API_URL + '/examvoice/');
  }

  getAllVoicesData(eid: string) {
    return this.http.get(API_URL + '/examdata?examid='+eid);
  }

  // Imposta l'esame attivo
  setActive(id: string, url:string = null) {
    //console.log("SetActive ",id);
    this.activeExamId = id;
    this.getExam(id).subscribe(data => {
      this.activeExam = JSON.parse((<any>data)._body) as Exam;
      this.saveOnLocal(this.activeExam);
      this.getAllVoicesData(id).subscribe(_data => {
        this.loadAllVoices().subscribe(_voices => {
          var d = JSON.parse((<any>_data)._body);
          var v = JSON.parse((<any>_voices)._body);
          this.activeExamVoices = this.merge(d,v);
          //console.log(this.activeExamVoices);
          this.calculateExamScore();
          if (url != null) 
            this.router.navigate([url]);
        });
      })
      //console.log("EXA service: ",this.activeExam);
    },
    error => console.log(error,id));
  }

  forceReload() {
    this.getMyExamList().subscribe(response => {
      var data = JSON.parse((<any>response)._body) as Exam[];
      this.allMyExams = data;
      var lastActive = this.activeExamId;
      for (let e of this.allMyExams) {
        var id = e.id;
        this.setActive(id);
      }
      if (lastActive != undefined) this.setActive(lastActive);
      else this.activeExamId = lastActive;
    });

  }

  // Salva i dati in localstorage
  saveOnLocal(e: Exam) {
    this.activeExam = e;
    localStorage.setItem('activeExam',JSON.stringify(this.activeExam));
  }

  // carica i dati da localstorage
  loadFromLocal() {
    var exam = JSON.parse(localStorage.getItem('activeExam'));
    this.activeExam = exam;
    return this.activeExam;
  }

  // Restituisce l'esame attivo
  getActiveExam() {
    if (this.activeExam == undefined) this.loadFromLocal();
    return this.activeExam;
  }

  getActiveExamVoices(): ExamVoice[] {
    this.loadFromLocal();
    return this.activeExamVoices;
  }

  saveActiveExam(e: Exam) {
    //console.log("saveActiveExam(e:Exam):todo");
  }
  
  saveActiveExamVoices(v: ExamVoice[]) {
    //console.log("saveActiveExamVoices(e:Exam):todo");
  }


  deleteExamData(eid: string) {
    this.http.get(API_URL + '/examdata?examid=' + eid).subscribe(data => {
      var voices = (JSON.parse((<any>data)._body));
      for (let v of voices) {
        this.http.delete(API_URL + '/examdata/' + v.id).subscribe(
          response => {}, 
          errors => console.log(errors)
        );
      }
      // TODO: Alert esame eliminato
    });
  }


  deleteExam(id: string) {
    return this.http.delete(API_URL + '/exam/' + id);
  }

  saveExam(e: Exam) {
    //this.setActive(e.id);
    return this.http.post(API_URL + '/exam/' + e.id , e);
  }

  saveExamData(id: string, obj) {
    return this.http.put(API_URL + '/examdata/'+id,obj);
  }

  addNewRecording(examid, filename){
    /*
    var nuovo: Exam = new Exam(this.activeExam.date, this.activeExam.user, this.activeExam.patient);
    nuovo = this.activeExam;
    nuovo.recordings = [""+filename];
    */
    this.activeExam.recordings = [""+filename];
    //console.log(this.activeExam, examid);
    return this.http.put(API_URL + '/exam/' + examid, this.activeExam);
  }

  loadActiveExam() {
    //console.log(this.activeExamId);
    return this.http.get(API_URL + '/examdata?examid=' + this.activeExamId);
  }


  loadPalette() {
    return this.http.get(API_URL + '/examgroup');
  }

  merge(data:any[], voices:any[]) {
    var examData = [];
    if (data.length != voices.length) {
      //console.log("Error! lunghezze array differenti",data.length," vs ",voices.length);
      return [];
    }
    else {
      //console.log("ok, array uguali");
      for (var i=0; i<data.length; i++) {
        for (var j=0; j<voices.length; j++) {
          if (data[i].voiceid === voices[j].id)
            examData.push(new ExamVoice(data[i],voices[j]));
        }
      }
      return examData;
    }
  }

  splitInColumns(data) {
    var new_data: ExamVoice[][];
    new_data = new Array<Array<ExamVoice>>();
    for (let d of data) {
      //console.log(d);
      if (typeof (new_data[d.gruppo-1]) != 'undefined')
        new_data[d.gruppo-1][d.riga-1] = d;
      else {
        new_data[d.gruppo-1] = new Array<ExamVoice>();
          new_data[d.gruppo-1][d.riga-1] = d;
      }
    }
    return (new_data);
  }

  calculateExamScore() {
    var tot = 0;
    for (let v of this.activeExamVoices) {
      tot += v.punteggio;
      //console.log(v.punteggio);
    }
    this.activeExam.score = tot;
    //console.log(tot);
    this.saveExam(this.activeExam).subscribe(exam => {
      this.activeExam = JSON.parse((<any>exam)._body) as Exam;
      //console.log(this.activeExam.score);
      this.refresh();
    });
  }

  loadGroups() {
    return this.http.get(API_URL + '/examgroup/');
  }

  public print() {
    if (this.activeExam != undefined) console.log(this.activeExam.id);
    else console.log("Nessun esame selezionato");
  }

}
