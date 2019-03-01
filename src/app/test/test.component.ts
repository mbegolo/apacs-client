import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../_helpers/must-match.validator';
import { User, Exam } from '../_models';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../_services';
import { ExamService } from '../_services';
import { PatientService } from '../_services';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  private lastExams: Exam[];

  constructor(private examService: ExamService, private patientService: PatientService) {
    this.examService.loadAllMyExams();
  }

  ngOnInit() {
    this.getMyLastExams(5);
  }

  getMyLastExams(i:number) {
    this.examService.getMyExamList().subscribe(data => {
      var obj = JSON.parse((<any>data)._body);
      this.lastExams = obj.slice(obj.length-i);
    });
  }

  createNewExam() {
    this.patientService.createNewPatient().subscribe(response => {
      var pid = (JSON.parse( (<any>response)._body)).id;
      this.examService.createNewExam(pid).subscribe(data => {
        var new_exam = JSON.parse((<any>data)._body);
        console.log(new_exam);
        this.examService.saveOnLocal(new_exam);
        this.getMyLastExams(5);
      });
    });
  }

  getActualExamId() {
    console.log(this.examService.getActiveExam());
  }

  test(i) {
    this.getMyLastExams(5);
  };
}
