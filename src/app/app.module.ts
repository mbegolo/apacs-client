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


@NgModule({
  declarations: [
    AppComponent,
    UserComponentComponent,
    LoginComponent,
    RegisterFormComponent,
    AlertMessageComponent,
    LoggedUserWrapperComponent,
    ExamViewComponent,
    DashboardComponent
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
