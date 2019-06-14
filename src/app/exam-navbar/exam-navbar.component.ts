import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { ExamService, PatientService, DataService } from '../_services';

@Component({
  selector: 'app-exam-navbar',
  templateUrl: './exam-navbar.component.html',
  styleUrls: ['./exam-navbar.component.scss']
})
export class ExamNavbarComponent implements OnInit {

  public exitModal: boolean;
  public switchModal: boolean;
  public desiredUrl: string;
  public unstagedChanges: boolean = false;
  private activePatient: boolean = false;
  private activeInterview: boolean = false;
  private activeResume: boolean = false;

  @Output() saveEvent = new EventEmitter<string>();

  constructor(
    private examService: ExamService, 
    private patientService: PatientService, 
    private dataService: DataService, 
    private router: Router
  ) { }

  ngOnInit() { }

  savePatient() {
    this.saveEvent.emit('savePatient');
  }

  saveInterview() {
    this.saveEvent.emit('saveInterview');
  }

  isActive(s: string) {
    var _url = window.location.href.split('/');
    var actualUrl = '/'+_url[_url.length-1];
    return (s === actualUrl);
  }

  goTo(url: string) {
    this.unstagedChanges = this.dataService.pendingChanges();
    //var _url = window.location.href.split('/');
    //var actualUrl = '/'+_url[_url.length-1];
    var actualUrl = this.getActualUrl;
    this.desiredUrl = url;
    if (this.unstagedChanges) this.openSwitchModal();
    else this.navigateTo(this.desiredUrl);
  }

  getActualUrl() {
    var _url = window.location.href.split('/');
    return '/'+_url[_url.length-1];
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }

  ignoreEdit() {
    this.dataService.setChanges(false);
    this.router.navigate([this.desiredUrl]);
  }

  exit() {
    this.examService.setActive(this.examService.activeExam.id);
    this.router.navigate(['']);
  }
  
  saveExit() {
    if (this.getActualUrl() == '/editpatient') this.saveInterview();
    else if (this.getActualUrl() == '/interview') this.savePatient();
    this.exit();
  }

  saveMove() {
    if (this.getActualUrl() == '/editpatient') this.saveInterview();
    else if (this.getActualUrl() == '/interview') this.savePatient();
    this.navigateTo(this.desiredUrl);
  }

  openModal() {
    this.unstagedChanges = this.dataService.pendingChanges();
    if (this.unstagedChanges) this.exitModal = true;
    else this.exit();
  }

  closeModal() {
    this.exitModal = false;
  }

  openSwitchModal() {
    this.unstagedChanges = this.dataService.pendingChanges();
    this.switchModal = true;
  }

  closeSwitchModal() {
    this.switchModal = false;
  }
}
