import { Component, OnInit, ViewChildren, QueryList  } from '@angular/core';
import { InterviewItemComponent } from '../interview-item/interview-item.component';
import { RecordingComponent } from '../recording/recording.component';
import { UserService, ExamService, PatientService, DataService } from '../_services';
import { Exam,ExamVoice} from '../_models';
import { Observable, Subject } from 'rxjs';


@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit {

  @ViewChildren(InterviewItemComponent) children: QueryList<InterviewItemComponent>; 
  @ViewChildren(RecordingComponent) recordingComponent: QueryList<RecordingComponent>; 

  registration_on: boolean = true;

  //private all_items: any[];

  private exam: Exam;
  private _examId = new Subject<string>();
  private recorder;
  private examData: any;
  public loaded: boolean = false;
  public reset_data;
  private palette: string[] = ["","","","",""];
  private enabled: boolean = false;
  private changesOccurred: boolean = false;


  //constructor(private  apiService:  APIService) { }
  constructor(private userService:UserService,
    private examService:ExamService,
    private dataService: DataService,
    private patientService:PatientService) { }


  ngOnInit() {
    this.changesOccurred = false;
    this.loadData();
    this.loadPalette();
    //this.startrecordingComponent();
    //this.recordingComponent.first.hello();
  }

  ngAfterViewInit() {
    this.recorder = this.recordingComponent.first;
    this.getExam().subscribe(data => {
      this.exam.id = data;
      this.recorder.setExamId(this.exam.id);
      this.recorder.getStartEvent().subscribe(data => {
        this.startRecording();
      });
      this.recorder.getStopEvent().subscribe(data => {
        this.stopRecording();
      });
    });
  }

  private getExam(): Observable<string> {
    return this._examId.asObservable();
  }

  loadData() {
    this.examService.loadActiveExam().subscribe(
      data => {
        this.exam = this.examService.getActiveExam();
        this._examId.next(this.exam.id);
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

  loadPalette() {
    this.examService.loadPalette().subscribe(data => {
      var d = JSON.parse((<any>data)._body);
      for (let p of d) {
        //console.log(p.colore,p.ordine);
        this.palette[p.ordine-1] = p.colore;
      }
    });
  }

  saveData() {
    this.stopRecording();
    this.children.forEach(it => {
      it.save();
    });
    this.changesOccurred = false;
    this.dataService.setChanges(false);
    this.loadData();
  }

  resetData() {
    this.stopRecording();
    this.children.forEach(it => {
      it.reset();
    });
    this.changesOccurred = false;
    this.dataService.setChanges(false);
    this.loadData();
  }

  startRecording() {
    this.enabled = true;
    this.changesOccurred = true;
    this.dataService.setChanges(true);
  }

  stopRecording() {
    this.enabled = false;
    this.recordingComponent.first.stopRecording();
  }

  togglePanel() {
    this.changesOccurred = true;
    this.dataService.setChanges(true);
    if (this.enabled) this.enabled = false;
    else this.enabled = true;
  }
}
