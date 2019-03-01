import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedUserWrapperComponent } from './logged-user-wrapper/logged-user-wrapper.component'; 
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExamListViewComponent } from './exam-list-view/exam-list-view.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main', component: LoggedUserWrapperComponent, children: [
    { path: 'dashboard', component: DashboardComponent, outlet: 'logged' },
    { path: 'exams', component: ExamListViewComponent, outlet: 'logged' },
    //{ path: '', redirectTo: 'dashboard', pathMatch: 'prefix' }
  ] },
  { path: '', redirectTo: 'main', pathMatch: 'prefix'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
