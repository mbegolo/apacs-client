import { Component, OnInit } from '@angular/core';
import { Exam, Patient, User } from '../_models';

import { DataService } from '../_services';

@Component({
  selector: 'app-edit-exam-view',
  templateUrl: './edit-exam-view.component.html',
  styleUrls: ['./edit-exam-view.component.scss']
})
export class EditExamViewComponent implements OnInit {
  selectedExam: Exam;
  currentUser: User;
  actualPatient: Patient;

  anagrafica: string;
  username: string;
  patientName: string;
  examDate: string;
  examScore: string;

  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.dataService.loadSelectedExam();
    this.selectedExam = this.dataService.getSelectedExam();
    this.currentUser = this.dataService.getCurrentUser();
    this.actualPatient = this.dataService.getPatientData();
  }

}
