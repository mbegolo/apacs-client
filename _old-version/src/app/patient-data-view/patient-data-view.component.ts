import { Component, OnInit } from '@angular/core';

import { DataService } from '../_services';
import { User, Exam, Patient } from '../_models';

declare var $: any;

@Component({
  selector: 'app-patient-data-view',
  templateUrl: './patient-data-view.component.html',
  styleUrls: ['./patient-data-view.component.scss']
})
export class PatientDataViewComponent implements OnInit {

  currentUser: User;
  selectedExam: Exam;
  private model : Patient;

  private submitted = false;
  private today = new Date().toISOString().split("T")[0];
  private anni_scol: any[];
  private diagnosi: any[];

  constructor(private  dataService: DataService) {}

  ngOnInit() {
    //$('[data-toggle="tooltip"]').tooltip();
    this.currentUser = this.dataService.getCurrentUser();
    this.selectedExam = this.dataService.getSelectedExam();
    this.model = this.dataService.getPatient();
    this.anni_scol = this.dataService.scolarita;
    this.diagnosi = this.dataService.diagnosi;
    if (this.model.esaminatore == "") 
      this.model.esaminatore = this.dataService.getCurrentUsername();
    if (this.model.data ==  null) {
      var d = new Date();
      this.model.data = d.getFullYear() +'-'+ (d.getMonth()+1) +'-'+ d.getUTCDate();
      console.log(this.model.data);
    }
  }

  onSubmit() {
    this.submitted = true;
    this.dataService.savePatient(this.model);
  }

  newExam() {
    this.dataService.newExam();
  }
}
