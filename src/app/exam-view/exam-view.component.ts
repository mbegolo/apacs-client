import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { ExamService, PatientService, DataService } from '../_services';

@Component({
  selector: 'app-exam-view',
  templateUrl: './exam-view.component.html',
  styleUrls: ['./exam-view.component.scss']
})
export class ExamViewComponent implements OnInit {

  private basic: boolean;
  private unstagedChanges: boolean = false;

  @Output() saveEvent = new EventEmitter<string>();

  constructor(
    private examService: ExamService, 
    private patientService: PatientService, 
    private dataService: DataService, 
    private router: Router
    ) { }


  ngOnInit() {
    //this.dataService.
  }

  savePatient() {
    this.saveEvent.emit('savePatient');
  }

  exit() {
    this.examService.setActive(this.examService.activeExam.id);
    this.router.navigate(['']);
  }

  saveExit() {
    //TODO
    console.log("TODO: al momento non salva davvero");
    this.exit();
  }

  saveAll() {
    //this.examService.saveExam(this.examService.getActiveExam());
  }

  openModal() {
    this.unstagedChanges = this.dataService.pendingChanges();
    this.basic = true;
  }

  test() {
    this.basic = false;
  }

}