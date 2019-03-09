import { Component, OnInit } from '@angular/core';
import { ClrDatagridSortOrder } from '@clr/angular';
import { ClrDatagridStringFilterInterface } from "@clr/angular";
import { Router } from "@angular/router";

import { User, Exam, Patient } from '../_models';
import { UserService, ExamService, PatientService } from '../_services';

class DateFilter implements ClrDatagridStringFilterInterface<Exam> {
  private asd = false;
  private date;
  private d;
  private m;
  private y;
  private cf;
    accepts(exam: Exam, search: string):boolean {
      this.cf="";
      this.date = new Date(exam.date);
      this.d = ("0"+this.date.getDate()).slice(-2);
      this.m = ("0"+(this.date.getMonth()+1)).slice(-2);
      this.y = this.date.getFullYear();
      this.cf = this.d+"/"+this.m+"/"+this.y+" "+  this.cf + this.d+"-"+this.m+"-"+this.y+" "+  this.cf + this.d+"."+this.m+"."+this.y+" ";
      this.cf = this.cf + " " +this.y+"/"+this.m+"/"+this.d+" " +this.y+"-"+this.m+"-"+this.d+" " +this.y+"."+this.m+"."+this.d+" ";
      this.cf = this.cf + " " +this.m+"/"+this.d+"/"+this.y+" " +this.m+"-"+this.d+"-"+this.y+" " +this.m+"."+this.d+"."+this.y+" ";

      console.log(this.cf);
      return this.cf.includes(search);
    }
}

class NameFilter implements ClrDatagridStringFilterInterface<Exam> {
  accepts(exam: Exam, search: string): boolean {
    console.log((<any>exam.patient).id);
    return ((<any>exam.patient).nome).toLowerCase().includes(search);
  }
}

class SurnameFilter implements ClrDatagridStringFilterInterface<Exam> {
  accepts(exam: Exam, search: string): boolean {
    return ((<any>exam.patient).cognome).toLowerCase().includes(search);
  }
}

@Component({
  selector: 'app-exam-list-view',
  templateUrl: './exam-list-view.component.html',
  styleUrls: ['./exam-list-view.component.scss']
})
export class ExamListViewComponent implements OnInit {

  

  private exams: Exam[];
  private patients: Patient[] = [];
  private total: number;
  private dateFilter = new DateFilter();
  private nameFilter = new NameFilter();
  private surnameFilter = new SurnameFilter();
  private loaded_data = false;
  private defaultSort = ClrDatagridSortOrder.DESC;

  constructor(private router:Router, private examService: ExamService, private patientService: PatientService) {
    
  }

  ngOnInit() {
    this.refresh();
    //console.log(this.patients);
  }

  refresh() {
    this.examService.getMyExamList().subscribe(data => {
      this.exams = JSON.parse((<any>data)._body);
      //this.patients = [];
      var pat_id = "";
      this.total = this.exams.length;
      for (let exam of this.exams) {
        pat_id = (<any>exam.patient).id;
        //console.log(pat_id);
        this.patientService.getPatient(pat_id).subscribe(response => {
          exam.patient = JSON.parse((<any>response)._body);
        });
      };
      this.loaded_data = true;
    });
    //console.log(this.patients);
  }

  editExam(eid:string, pid:string) {
    this.examService.setActive(eid);
    this.patientService.setActive(pid);
    //console.log(this.examService.getActiveExam(), this.patientService.getActivePatient());
    this.examService.getExam(eid).subscribe(_exam => {
      this.patientService.getPatient(pid).subscribe(_pat => {
        //this.router.navigate(['main',{ outlets: { logged: ['exam'] } }]);
        this.router.navigate(['exam']);
      });
    });
  }

  deleteExam(e) {
    this.examService.deleteExam(e).subscribe(
      response => {
        this.examService.deleteExamData(e);
        this.refresh();
      },
      errors => console.log(errors)
    );
    console.log("elimina ",e);
  }

  createNewExam() {
    this.patientService.createNewPatient().subscribe(data => {
      var d = (JSON.parse((<any>data)._body));
      var pid = d.id;
      this.patientService.saveOnLocal(d as Patient);
      this.examService.createNewExam(pid).subscribe( _exam => {
        var eid = (JSON.parse((<any>_exam)._body)).id;
        this.examService.loadAllVoices().subscribe(_voices => {
          var voices = (JSON.parse((<any>_voices)._body));
          console.log(voices);
          for (let v of voices) {
            this.examService.createVoiceData(v.id,eid).subscribe(_voice => {
              console.log(JSON.parse((<any>_voice)._body));
            });
          };
          this.refresh();
        });
      });
    })
  }
}
