import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
//import { fakeBackendProvider } from './_helpers';

import { AppComponent }  from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AlertComponent } from './_directives';
import { AuthGuard, ExamGuard } from './_guards';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AlertService, AuthenticationService, UserService, ExamService, DataService } from './_services';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { NavbarComponent } from './navbar/navbar.component';
import { ExamListComponent } from './exam-list/exam-list.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { NglModule } from 'ng-lightning/ng-lightning';
import { EditExamViewComponent } from './edit-exam-view/edit-exam-view.component';

library.add(fas);
/*
lista icone
https://fontawesome.com/icons?d=gallery&q=menu&s=solid&m=free
*/

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatExpansionModule,
        BrowserAnimationsModule,
        FontAwesomeModule,
        NglModule.forRoot(),
        FormsModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        NavbarComponent,
        ExamListComponent,
        EditExamViewComponent
    ],
    providers: [
        AuthGuard,
        ExamGuard,
        AlertService,
        AuthenticationService,
        UserService,
        ExamService,
        DataService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        // fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }