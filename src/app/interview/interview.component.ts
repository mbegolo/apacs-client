import { Component, OnInit, ViewChildren, QueryList  } from '@angular/core';
import { InterviewItemComponent } from '../interview-item/interview-item.component';
//import { APIService } from  '../api.service';
import { UserService } from '../_services';
import { ExamService } from '../_services';
import { PatientService } from '../_services';
import { Exam,ExamVoice} from '../_models';


@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit {

  @ViewChildren(InterviewItemComponent) children: QueryList<InterviewItemComponent>; 

  registration_on: boolean = true;

  //private all_items: any[];

  private exam: Exam;
  private examData: any;
  private loaded: boolean = false;
  private palette: string[] = ["","","","",""];


  //constructor(private  apiService:  APIService) { }
  constructor(private userService:UserService,
    private examService:ExamService,
    private patientService:PatientService) { }


  ngOnInit() {
    this.loadData();
    this.loadPalette();
  }

  loadData() {
    this.examService.loadActiveExam().subscribe(
      data => {
        this.exam = this.examService.getActiveExam();
        var my_data = JSON.parse((<any>data)._body);
        this.examService.loadAllVoices().subscribe(_voices => {
          var my_voices = JSON.parse((<any>_voices)._body);
          var ex_data = this.examService.merge(my_data, my_voices);
          this.examData = this.splitInColumns(ex_data);
          console.log(this.examData);
          this.loaded = true;
        });
      },
      errors => {
         console.log(errors)
      }
    );
  }

  splitInColumns(data) {
    var new_data: ExamVoice[][];
    new_data = new Array<Array<ExamVoice>>();
    for (let d of data) {
      //console.log(d);
      if (typeof (new_data[d.gruppo-1]) != 'undefined')
        new_data[d.gruppo-1][d.riga-1] = d;
      else {
        new_data[d.gruppo-1] = new Array<ExamVoice>();
          new_data[d.gruppo-1][d.riga-1] = d;
      }
    }
    return (new_data);
  }

  printExam(){
    console.log(this.exam);
  }
  printData(){
    console.log(this.examData);
  }

  loadPalette() {
    this.examService.loadPalette().subscribe(data => {
      var d = JSON.parse((<any>data)._body);
      for (let p of d) {
        console.log(p.colore,p.ordine);
        this.palette[p.ordine-1] = p.colore;
      }
    });
  }

  saveData() {
    //for (var i=0; i<this.children.length; i++) {
      this.children.forEach(it => {
        //console.log(it.progress);
        it.save();
      });
    //}
  }
  /*

  loadData() {
    this.exam = this.apiService.loadExam();
  }

  toggleRegistration() {
    if (this.registration_on) this.stopRegistration();
    else this.startRegistration();
  }

  startRegistration() {
    this.registration_on = !this.registration_on;
    this.enableAll()
  }

  stopRegistration() {
    this.registration_on = !this.registration_on;
    this.disableAll()
  }

  onSubmit() {
    var r = confirm("Stai salvando i dati relativi a questo esame. Sei sicuro di vler continuare?");
    if (r == true) {
      this.saveAll();
    }
  }

  saveAll() {
    //localStorage.clear();
    //console.log("read: "+this.children);
    for (var i=0; i<this.children.length; i++) {
      this.children.forEach(it => it.save());
    }
  }

  enableAll() {
    //alert(this.children.length);
    for (var i=0; i<this.children.length; i++) {
      this.children.forEach(it => it.enable());
    }
  }

  disableAll() {
    for (var i=0; i<this.children.length; i++) {
      this.children.forEach(it => it.disable());
    }
  }

  clearData() {
    var r = confirm("Sei sicuro di voler cancellare tutti i dati?");
    if (r == true) {
      localStorage.clear();
      window.location.reload();
    }
  }
*/

}
