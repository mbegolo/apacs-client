import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-exam-view',
  templateUrl: './exam-view.component.html',
  styleUrls: ['./exam-view.component.scss']
})
export class ExamViewComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  exit() {
    this.router.navigate(['main',{ outlets: { logged: ['dashboard'] } }]);
  }

}