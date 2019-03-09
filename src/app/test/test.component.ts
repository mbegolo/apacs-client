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
  ids: any[];

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

  test() {
    /*
    this.patientService.createNewPatient().subscribe(data => {
      var pid = (JSON.parse((<any>data)._body)).id;
      console.log(pid);
      this.examService.generateExam(pid);
    })
    
    /*
    var dati;
    this.examService.loadAllData().subscribe(data => {
      dati = (JSON.parse((<any>data)._body));
      //this.ids = (dati);
      //var i = 0;
      //this.ids = [];
      for (let d of dati) {
        d.examid = "3175ba3924e21890";
        //d.treshold1 = 1;
        //d.treshold2 = 2;
        this.examService.editData(d.id, d).subscribe(response => {
          console.log(d)
        }, errors => console.log("fail"));
      }
    });
    */
  }

  testDel() {
    var todel = "5890a08fe74d98f9";
    this.examService.deleteExamData(todel)
    /*.subscribe(
      data => console.log(data), 
      errors => console.log(errors)
    );
    */
  }

  print() {
    /*
    for (let id of this.ids) {
      //console.log(id.id);
      this.examService.createVoiceData(id.id,id.id).subscribe(
        success => console.log("success"), 
        errors => console.log("fail")
      );
    }
    */
  }

  getAllDataId() {
    /*
    this.examService.getAllDataId().subscribe(success => {
      var out = JSON.parse((<any>success)._body);
      //console.log(out);
      this.generateArray(out);
    })
    */
  }

  generateArray(o) {
    var es = [];
    var i=0;
    for (let a of o) {
      es[i] = a.id;
      i++;
    }
    console.log(es);
  }
}
