import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserService } from '../_services/user.service'
import { ExamService } from '../_services/exam.service'
import { AlertService } from '../_services/alert.service'
import { Router } from '@angular/router';

import { User, Exam, Patient } from '../_models';

declare var require: any;

declare var $: any;

@Injectable() 
export class DataService {
  currentUser: User;
  selectedExam: Exam;
  usersExams: Exam[];
  isNewExam: boolean;
  diagnosi;
  scolarita;


  constructor(
    private userService: UserService, 
    private examService: ExamService, 
    private alertService: AlertService,
    private router: Router ) {
    this.loadSettings();
    this.isNewExam = false;
  }

  loadUser() {
    var localUser = JSON.parse(localStorage.getItem('currentUser'));
    if (localUser != null) {
      this.currentUser = new User();
      this.currentUser.id = localUser["user"]["_id"];
      this.currentUser.username = localUser["user"]["username"];
      this.currentUser.email = localUser["user"]["email"];
      this.currentUser.token = localUser["jwt"];
    }
    else alert("Devi effettuare la login");
  }

  loadAllExams() {
    //this.loadUser();
    var localUsersExams = JSON.parse(localStorage.getItem('usersExams'));
    if ( (localUsersExams == null) || ((localUsersExams as any[]).length == 0) ) {
      this.usersExams = this.examService.getAllExams(this.currentUser.id);
      localStorage.setItem('usersExams', JSON.stringify(this.usersExams));
    }
    else {
      this.usersExams = localUsersExams;
    }
  }
  forceReloadAllExams() {
    //this.usersExams = null;
    localStorage.removeItem('usersExams');
    this.loadAllExams();
  }

  loadExamById(id: string) {
    if (this.usersExams == null)
      this.loadAllExams();
    for (var i=0; i<this.usersExams.length; i++) {
      var exam = this.usersExams[i];
      if (exam["id"] == id) {
        this.selectedExam = exam;
        localStorage.setItem('selectedExam', JSON.stringify(this.selectedExam));
        //alert("change selected exam: \n"+JSON.stringify(this.selectedExam));
      }
    }
    return this.selectedExam;
  }

  loadSelectedExam() {
    var localExam = JSON.parse(localStorage.getItem('selectedExam'));
    if (localExam != null) 
      this.selectedExam = localExam as Exam;
  }

  setSelectedExam(exam: Exam) {
    this.selectedExam = exam;
    localStorage.setItem('selectedExam', JSON.stringify(this.selectedExam));
  }

  getCurrentUser() {
    this.loadUser();
    return this.currentUser;
  }

  getCurrentUsername() {
    this.loadUser();
    return this.currentUser.username;
  }

  getCurrentId() {
    this.loadUser();
    return this.currentUser.id;
  }

  getExamById(id) {
    var e: any;
    for (e in this.usersExams) {
      if (e.id == id) {
        return e;
      }
    }
    return null;
  }

  getAllExams() {
    if (this.usersExams == null)
      this.loadAllExams();
    return this.usersExams;
  }

  getSelectedExam() {
    this.loadSelectedExam();
    return this.selectedExam;
  }

  getPatient() {
    console.log("data.service:125",this.selectedExam);
    return this.selectedExam["anagrafica"] as Patient;
  }

  getPatientName() {
    return this.selectedExam["anagrafica"]["nome"] + " " + this.selectedExam["anagrafica"]["cognome"];
  }

  getExamDate() {
    return this.selectedExam["createdAt"];
  }

  getExamScore() {
    return this.selectedExam["punteggi"];
  }

  getPatientData() {
    var p = this.selectedExam["anagrafica"];// as Patient;
    console.log(p);
    return p;
  }

  hasSelectedExam() {
    return (this.selectedExam != null);
  }

  loadScolarita() {
    var file = require('../config-files/anni_scol.json');
    return file;
  }

  loadDiagnosi() {
    var file = require('../config-files/diagnosi.json');
    return file;
  }

  loadSettings() {
    this.scolarita = this.loadScolarita();
    this.diagnosi = this.loadDiagnosi();
  }

  savePatient(p: Patient) {
    if (this.isNewExam) {
      this.saveNewExam(p);
      this.isNewExam = false;
      alert("save new exam");
    }
    else {
      this.selectedExam["anagrafica"] = p;
      if ( (this.selectedExam["Nome"] == '')||(this.selectedExam["Nome"] == null)) {
        this.selectedExam["Nome"] = p.nome + ' ' + p.cognome;
        localStorage.setItem('selectedExam', JSON.stringify(this.selectedExam));
        console.log(this.selectedExam["Nome"]);
      }
      console.log("voglio salvare l'esame", this.selectedExam["Nome"]);
      var response = this.examService.saveExam(this.selectedExam);
      $('#close-save-modal').click();
      if (response) {
        console.log(response);
        this.alertService.success("Esame salvato correttamente");
        localStorage.setItem('selectedExam', JSON.stringify(this.selectedExam));
        //this.forceReloadAllExams();
        return true;
      }
      else return false;
    }
  }

  newExam() {
    this.isNewExam = true;
    this.selectedExam = new Exam();
    this.selectedExam.anagrafica = new Patient();
    localStorage.removeItem('selectedExam');
    this.router.navigate(['./editExam']);
    console.log(this.selectedExam);
  }

  saveNewExam(a: Patient) {
    //var new_pat = this.examService.newAnagrafica();
    var new_pat = this.examService.newAnagrafica(a);
    var new_exam = this.examService.newExam(this.currentUser);
    new_exam["Nome"] = a.nome + ' ' + a.cognome;
    new_pat.subscribe(
      _pat => {
        var pat = _pat as Patient;
        new_exam.subscribe(
          _exam => {
            var exam = _exam as Exam;
            exam.anagrafica = pat;
            pat.esame = exam.id;
            this.setSelectedExam(exam);
            console.log("OK OK");
            this.router.navigate(['./editExam']);
            this.savePatient(this.selectedExam.anagrafica);
          }
        );
      }
    );
  }

  deleteExam(id) {
    var exam_to_del = this.loadExamById(id) as Exam;
    var pat_to_del = exam_to_del.anagrafica as Patient;
    console.log("DELETE EXAM"+JSON.stringify(exam_to_del));
    console.log("DELETE Patient"+JSON.stringify(pat_to_del));
    this.examService.deleteAnagrafica(pat_to_del);
    this.examService.deleteExam(exam_to_del);
    localStorage.removeItem('usersExams');
    window.location.reload();
  }

} 
