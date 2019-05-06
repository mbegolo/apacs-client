import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ExamService } from '../_services';

@Component({
  selector: 'app-exam-view',
  templateUrl: './exam-view.component.html',
  styleUrls: ['./exam-view.component.scss']
})
export class ExamViewComponent implements OnInit {

  constructor(private examService:ExamService,private router:Router) { }

  ngOnInit() {
  }

  exit() {
    this.examService.setActive(this.examService.activeExam.id);
    this.router.navigate(['dashboard']);
  }

}