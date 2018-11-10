import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserService } from '../_services/user.service'
import { ExamService } from '../_services/exam.service'
import { AlertService } from '../_services/alert.service'

import { User, Exam, Patient } from '../_models';

declare var require: any;

@Injectable() 
export class DataService {
  currentUser: User;
  selectedExam: Exam;
  usersExams: Exam[];
  diagnosi;
  scolarita;


  constructor(
    private userService: UserService, 
    private examService: ExamService, 
    private alertService: AlertService ) {
    this.loadSettings();
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
    this.loadUser();
    var localUsersExams = JSON.parse(localStorage.getItem('usersExams'));
    if ( (localUsersExams == null) || ((localUsersExams as any[]).length == 0) ) {
      this.usersExams = this.examService.getAllExams(this.currentUser.id);
      localStorage.setItem('usersExams', JSON.stringify(this.usersExams));
    }
    else {
      this.usersExams = localUsersExams;
    }
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
    // TODO save on server
    this.selectedExam["anagrafica"] = p;
    console.log("voglio salvare l'esame", this.selectedExam);
    var response = this.examService.saveExam(this.selectedExam);
    if (response) {
      this.alertService.success("Esame salvato correttamente");
      localStorage.setItem('selectedExam', JSON.stringify(this.selectedExam));
      return true;
    }
    else return false;
  }

  newExam() {
    console.log("make a new exam");
    var exam = new Exam();
    exam.user = this.getCurrentId();
    return this.examService.newExam(exam);
    // Crere un nuovo esame vuoto, poi impostarlo a selezionato, infine salvarlo
  }
} 
