import { Injectable } from '@angular/core';
import { User, Exam, Patient } from '../_models';
import { UserService, ExamService, PatientService } from '../_services';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
}
