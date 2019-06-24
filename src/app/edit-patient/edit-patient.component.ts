import { Component, OnInit } from '@angular/core';
//import { ClarityModule, ClrFormsNextModule } from '@clr/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { User, Exam, Patient } from '../_models';
import { UserService, ExamService, PatientService, DataService } from '../_services';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.scss']
})
export class EditPatientComponent implements OnInit {

  constructor(private route:ActivatedRoute, 
        private patientService: PatientService, 
        private examService: ExamService, 
        private userService: UserService,
        private dataService: DataService,
        private formBuilder: FormBuilder) { }

  public save_patient;
  public patientForm: FormGroup;
  public activeExam: Exam;
  public activePatient: Patient;
  public loggedUser: User;
  public show_sex: boolean;
  public left_handed: boolean;
  public right_handed: boolean;
  public both_handed: boolean;
  public submitted: boolean = false;
  public formIsChanged: boolean = false;

  ngOnInit() {
    
    this.activeExam = this.examService.getActiveExam();
    this.activePatient = this.patientService.getActivePatient();
    this.loggedUser = this.userService.getLoggedUser();
    this.checkPatientData();
    this.patientForm = this.formBuilder.group({
        nome: [this.activePatient.nome, Validators.required],
        cognome: [this.activePatient.cognome, Validators.required],
        sesso: [this.activePatient.sesso, Validators.required],
        eta: [this.activePatient.eta, Validators.required],
        lateralita: [this.activePatient.lateralita, Validators.required],
        luogonascita: [this.activePatient.luogonascita, Validators.required],
        professione: [this.activePatient.professione, Validators.required],
        scolarita: [this.activePatient.scolarita, Validators.required],
        lingua: [this.activePatient.lingua],
        altro: [this.activePatient.altro],
        diagnosi: [this.activePatient.diagnosi, Validators.required],
        data: [(''+this.activeExam.date).substring(0,10)],
        esaminatore: [this.loggedUser.name+" "+this.loggedUser.surname]
    });
    this.show_sex =this.activePatient.sesso;
    this.left_handed = this.activePatient.lateralita === 'l';
    this.right_handed = this.activePatient.lateralita === 'r';
    this.both_handed = this.activePatient.lateralita === 'b';
    //console.log(this.patientForm.controls);
    Object.keys(this.patientForm.controls).forEach(key => {
      //console.log(this.patientForm.controls[key]);
      this.patientForm.controls[key].valueChanges.subscribe(data => {
        this.formChanged();
      })
    });
    this.formIsChanged = false;
    this.dataService.setChanges(false);
  }

  get f() { return this.patientForm.controls; }

  formChanged() {
    this.formIsChanged = true;
    this.dataService.setChanges(true);
  }

  onSubmit() {
    //if (confirm("Sicuro di voler salvare? L'azione non è reversibile")) {
      var control = this.patientForm.controls;
      var new_exam: Exam = this.activeExam;
      new_exam.date = new Date(control.data.value);

      var new_pat: Patient = this.activePatient;
      new_pat.nome = control.nome.value;
      new_pat.cognome = control.cognome.value;
      new_pat.sesso = (control.sesso.value == "true" || control.sesso.value == true);
      new_pat.eta = control.eta.value;
      if (this.left_handed) new_pat.lateralita = 'l';
      else if (this.right_handed) new_pat.lateralita = 'r';
      else new_pat.lateralita = 'b';
      //new_pat.lateralita = (control.lateralita.value == "true" || control.lateralita.value == true);
      new_pat.luogonascita = control.luogonascita.value;
      new_pat.professione = control.professione.value;
      new_pat.scolarita = control.scolarita.value;
      new_pat.lingua = control.lingua.value;
      new_pat.altro = control.altro.value;
      new_pat.diagnosi = control.diagnosi.value;

      this.save(new_exam,new_pat);
    //}
  }

  checkPatientData() {
    if (this.activePatient.nome == "")
      this.activePatient.nome = null;
    if (this.activePatient.cognome == "")
      this.activePatient.cognome = null;
    if (this.activePatient.eta == 0)
      this.activePatient.lateralita = null;
    if (this.activePatient.luogonascita == "")
      this.activePatient.luogonascita = null;
    if (this.activePatient.professione == "")
      this.activePatient.professione = null;
    if (this.activePatient.scolarita == 0)
      this.activePatient.scolarita = null;
    if (this.activePatient.lingua == "")
      this.activePatient.lingua = null;
    if (this.activePatient.altro == "")
      this.activePatient.altro = null;
    if (this.activePatient.diagnosi == "")
      this.activePatient.diagnosi = null;
  }

  save(e: Exam, p: Patient) {
    this.patientService.savePatient(p).subscribe(data => {
      var returnobj = (JSON.parse((<any>data)._body));
      //console.log(returnobj);
      this.patientService.saveOnLocal(returnobj);
      this.formIsChanged = false;
      this.dataService.setChanges(false);
    },
    error => console.log(error));

    this.examService.saveExam(e).subscribe(data => {
      var returnobj = (JSON.parse((<any>data)._body));
      //console.log(returnobj);
      this.examService.saveOnLocal(returnobj);
      this.formIsChanged = false;
      this.dataService.setChanges(false);
    },
    error => console.log(error));
    //console.log(e,p);
  }

  print() {
    console.log(this.patientForm, Validators);
  }

}
