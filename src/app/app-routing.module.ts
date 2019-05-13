import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedUserWrapperComponent } from './logged-user-wrapper/logged-user-wrapper.component'; 
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExamListViewComponent } from './exam-list-view/exam-list-view.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { InterviewComponent } from './interview/interview.component';
import { ExamResumeComponent } from './exam-resume/exam-resume.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: LoggedUserWrapperComponent },
  { path: 'editpatient', component: EditPatientComponent },
  { path: 'interview', component: InterviewComponent },
  { path: 'resume', component: ExamResumeComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  //] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
