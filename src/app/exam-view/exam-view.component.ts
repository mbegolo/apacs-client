import { Component, OnInit } from '@angular/core';
//import { ClarityModule, ClrFormsNextModule } from '@clr/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';

import { User, Exam, Patient } from '../_models';
import { UserService, ExamService, PatientService } from '../_services';

@Component({
  selector: 'app-exam-view',
  templateUrl: './exam-view.component.html',
  styleUrls: ['./exam-view.component.scss']
})
export class ExamViewComponent implements OnInit {

  constructor(private route:ActivatedRoute, 
        private patientService: PatientService, 
        private examService: ExamService, 
        private userService: UserService,
        private formBuilder: FormBuilder) { }

  private patientForm: FormGroup;
  private activeExam: Exam;
  private activePatient: Patient;
  private loggedUser: User;
  private show_sex: boolean;
  private show_lat: boolean;

  ngOnInit() {
    this.activeExam = this.examService.getActiveExam();
    this.activePatient = this.patientService.getActivePatient();
    this.loggedUser = this.userService.getLoggedUser();
    this.patientForm = this.formBuilder.group({
        //email: ['', [Validators.required, Validators.email]],
        //password: ['', [Validators.required, Validators.minLength(6)]],
        nome: [this.activePatient.nome],
        cognome: [this.activePatient.cognome],
        sesso: [this.activePatient.sesso],
        eta: [this.activePatient.eta],
        lateralita: [this.activePatient.lateralita],
        luogonascita: [this.activePatient.luogonascita],
        professione: [this.activePatient.professione],
        scolarita: [this.activePatient.scolarita],
        lingua: [this.activePatient.lingua],
        altro: [this.activePatient.altro],
        diagnosi: [this.activePatient.diagnosi],
        data: [(''+this.activeExam.date).substring(0,10)],
        esaminatore: [this.loggedUser.name+" "+this.loggedUser.surname]
    });
    this.show_sex =this.activePatient.sesso;// ((this.activePatient.sesso == "true")||(this.activePatient.sesso == true));
    this.show_lat =this.activePatient.lateralita;// ((this.activePatient.lateralita == "true")||(this.activePatient.lateralita == true));
    console.log(this.show_sex,this.show_lat);
  }

  get f() { return this.patientForm.controls; }

  onSubmit() {
    if (confirm("Sicuro di voler salvare? L'azione non è reversibile")) {
      var control = this.patientForm.controls;
      var new_exam: Exam = this.activeExam;
      new_exam.date = new Date(control.data.value);

      var new_pat: Patient = this.activePatient;
      new_pat.nome = control.nome.value;
      new_pat.cognome = control.cognome.value;
      new_pat.sesso = (control.sesso.value == "true" || control.sesso.value == true);
      new_pat.eta = control.eta.value;
      new_pat.lateralita = (control.lateralita.value == "true" || control.lateralita.value == true);
      new_pat.luogonascita = control.luogonascita.value;
      new_pat.professione = control.professione.value;
      new_pat.scolarita = control.scolarita.value;
      new_pat.lingua = control.lingua.value;
      new_pat.altro = control.altro.value;
      new_pat.diagnosi = control.diagnosi.value;

      this.save(new_exam,new_pat);
    }
  }

  save(e: Exam, p: Patient) {
    this.patientService.savePatient(p).subscribe(data => {
      var returnobj = (JSON.parse((<any>data)._body));
      console.log(returnobj);
      this.patientService.saveOnLocal(returnobj);
    },
    error => console.log(error));

    this.examService.saveExam(e).subscribe(data => {
      var returnobj = (JSON.parse((<any>data)._body));
      console.log(returnobj);
      this.examService.saveOnLocal(returnobj);
    },
    error => console.log(error));
    //console.log(e,p);
  }

  printPat() {
    console.log(this.activePatient);
  }

  printExam() {
    console.log(this.activeExam);
  }
}
