import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedUserWrapperComponent } from './logged-user-wrapper/logged-user-wrapper.component'; 
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExamListViewComponent } from './exam-list-view/exam-list-view.component';
import { ExamViewComponent } from './exam-view/exam-view.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { InterviewComponent } from './interview/interview.component';
import { ExamResumeComponent } from './exam-resume/exam-resume.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main', component: LoggedUserWrapperComponent, children: [
    { path: 'dashboard', component: DashboardComponent, outlet: 'logged' },
    { path: 'exams', component: ExamListViewComponent, outlet: 'logged' },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ] },
  { path: '', redirectTo: 'main', pathMatch: 'prefix'},
  { path: 'exam', component: ExamViewComponent, children: [
    { path: 'editpatient', component:EditPatientComponent, outlet: 'exam'},
    { path: 'interview', component:InterviewComponent, outlet: 'exam'},
    { path: 'resume', component:ExamResumeComponent, outlet: 'exam'},
    { path: '', redirectTo: 'component', pathMatch: 'full' }
  ] }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
