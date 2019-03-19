import { Component, OnInit, ViewChildren, QueryList  } from '@angular/core';
import { InterviewItemComponent } from '../interview-item/interview-item.component';
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
  private enabled: boolean = false;


  //constructor(private  apiService:  APIService) { }
  constructor(private userService:UserService,
    private examService:ExamService,
    private patientService:PatientService) { }


  ngOnInit() {
    this.loadData();
    this.loadPalette();

    //this.startRecording();
  }

  loadData() {
    this.examService.loadActiveExam().subscribe(
      data => {
        this.exam = this.examService.getActiveExam();
        var my_data = JSON.parse((<any>data)._body);
        this.examService.loadAllVoices().subscribe(_voices => {
          var my_voices = JSON.parse((<any>_voices)._body);
          var ex_data = this.examService.merge(my_data, my_voices);
          this.examData = this.examService.splitInColumns(ex_data);
          this.examService.activeExamVoices = this.examData;
          this.examService.calculateExamScore();
          var delay = setTimeout(this.setLoaded(), 1000);
        });
      },
      errors => {
         console.log(errors)
      }
    );
  }

  setLoaded(): any {
    this.loaded = true;
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
    this.stopRecording();
    this.children.forEach(it => {
      it.save();
    });
    this.loadData();
  }

  resetData() {
    this.stopRecording();
    this.children.forEach(it => {
      it.reset();
    });
    this.loadData();
  }

  startRecording() {
    this.enabled = true;
  }

  stopRecording() {
    this.enabled = false;
  }

  test() {
    //this.examService.calculateExamScore();
    console.log(this.examService.activeExam.score);
  }
}
