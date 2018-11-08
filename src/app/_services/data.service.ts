import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserService } from '../_services/user.service'
import { ExamService } from '../_services/exam.service'

import { User, Exam, Patient } from '../_models';

@Injectable() 
export class DataService {
  currentUser: User;
  selectedExam: Exam;
  usersExams: Exam[];


  constructor(private userService: UserService, private examService: ExamService) { }

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
      }
    });
    return this.selectedExam;
  }

  loadSelectedExam() {
    var localExam = JSON.parse(localStorage.getItem('selectedExam'));
  }

  getCurrentUser() {
    this.loadUser();
    return this.currentUser;
  }

  getCurrentUsername() {
    this.loadUser();
    return this.currentUser.username;
  }

  getCurrentlId() {
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

  getPatientName() {
    return this.selectedExam["anagrafica"]["Nome"] + " " + this.selectedExam["anagrafica"]["Cognome"];
  }

  getExamDate() {
    return this.selectedExam["createdAt"];
  }

  getExamScore() {
    return this.selectedExam["punteggi"];
  }
} 
