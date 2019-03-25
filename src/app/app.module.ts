import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ClarityModule } from '@clr/angular';
import { UserComponentComponent } from './user-component/user-component.component';

import { UserService } from './_services';
import { LoginComponent } from './login/login.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { LoggedUserWrapperComponent } from './logged-user-wrapper/logged-user-wrapper.component';
import { ExamViewComponent } from './exam-view/exam-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TestComponent } from './test/test.component';
import { ExamListViewComponent } from './exam-list-view/exam-list-view.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { InterviewComponent } from './interview/interview.component';
import { InterviewItemComponent } from './interview-item/interview-item.component';
import { ExamResumeComponent } from './exam-resume/exam-resume.component';
import { PdfResumeComponent } from './pdf-resume/pdf-resume.component';
import { PdfExportComponent } from './pdf-export/pdf-export.component';


@NgModule({
  declarations: [
    AppComponent,
    UserComponentComponent,
    LoginComponent,
    RegisterFormComponent,
    AlertMessageComponent,
    LoggedUserWrapperComponent,
    ExamViewComponent,
    DashboardComponent,
    TestComponent,
    ExamListViewComponent,
    EditPatientComponent,
    InterviewComponent,
    InterviewItemComponent,
    ExamResumeComponent,
    PdfResumeComponent,
    PdfExportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    BrowserAnimationsModule,
    HttpModule,
    //AngularFontAwesomeModule,
    //NgbModule.forRoot()
    ClarityModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
