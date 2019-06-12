import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services';
import { ExamService } from '../_services';
import { PatientService } from '../_services';
import { Exam,ExamVoice} from '../_models';

@Component({
  selector: 'app-exam-resume',
  templateUrl: './exam-resume.component.html',
  styleUrls: ['./exam-resume.component.scss']
})
export class ExamResumeComponent implements OnInit {

  private exam;
  public examData;
  private patient;
  public loaded: boolean = false;
  public groups;
  public pdf_modal;


  constructor(private examService: ExamService, private patientService: PatientService) { }

  ngOnInit() {
    this.examService.loadGroups().subscribe(data => {
      this.groups = JSON.parse((<any>data)._body);
      this.loadData();
      this.exam = this.examService.getActiveExam();
      this.patient = this.patientService.getActivePatient();
    });
  }

  test() {
    console.log(this.examService.activeExam.score);
  }

  partialGroupScore(group) {
    var tot = 0;
    for (let it of group) {
      tot += it.punteggio;
    }
    return tot;
  }

  totalScore() {
    var tot = 0;
    for (let group of this.examData) {
      for (let it of group) {
        tot += it.punteggio;
      }
    }
    return tot;
  }

  setLoaded(): any {
    this.loaded = true;
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
          var delay = setTimeout(this.setLoaded(), 5000);
        });
      },
      errors => {
         console.log(errors)
      }
    );
  }

}
