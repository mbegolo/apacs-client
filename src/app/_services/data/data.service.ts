import { Injectable } from '@angular/core';
import { User, Exam, Patient } from '../../_models';
import { UserService, ExamService, PatientService } from '../../_services';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private unstagedChanges: boolean = false
  private obs = new Observable();

  constructor() { }

  pendingChanges() {
    return this.unstagedChanges;
  }

  setChanges(b: boolean) {
    this.unstagedChanges = b;
  }

}
