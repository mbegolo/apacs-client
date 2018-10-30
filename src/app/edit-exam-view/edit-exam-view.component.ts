import { Component, OnInit } from '@angular/core';
import { Exam } from '../_models';

@Component({
  selector: 'app-edit-exam-view',
  templateUrl: './edit-exam-view.component.html',
  styleUrls: ['./edit-exam-view.component.scss']
})
export class EditExamViewComponent implements OnInit {
  actualExam: Exam;

  constructor() { 
    this.actualExam = JSON.parse(localStorage.getItem('selectedExam'));
  }

  ngOnInit() {
    this.actualExam = JSON.parse(localStorage.getItem('selectedExam'));
  }

}
