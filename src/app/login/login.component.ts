import { Component, OnInit } from '@angular/core';
import { User } from '../_models';
import { UserService } from '../_services';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  wrongCredential = false;
  missingCredential = false;
  otherError = false;
  public newUserModal = false;
  error: string;

  constructor(private router:Router, private userService: UserService) { }

  ngOnInit() {
    if (this.userService.isUserLogged()) {
      this.router.navigate(['dashboard']);
    }
  }

  onSubmit() {
    this.tryLogin();
  }

  tryLogin() {
    this.userService.logIn(this.username,this.password).subscribe( 
      response => {
        this.onSuccess(response);
      }, 
      error => {
        this.onFail(error);
      }
    );
  }

  onSuccess(r) {
    //console.log("Login effettuata correttamente.");
    var uid = JSON.parse(r._body).uid;
    this.userService.getUser(uid).subscribe( data => {
      var usr = JSON.parse((<any>data)._body) as User;
      this.userService.logUser(usr);
      this.router.navigate(['dashboard']);
    });
  }

  onFail(e) { 
    console.log("Fail on login: ", e);
    if (e.status == "400" ) {
      this.missingCredential = true;
    }
    else if (e.status == "401" ) {
      this.clean();
      this.wrongCredential = true;
    }
    else {
      this.clean();
      this.otherError = true;
      this.error = "http error "+e.status+" - "+JSON.parse(e._body).message;
    }
  }

  checkUser() {
    if (this.userService.isUserLogged()) {
      return true;
    }
    return false;
  }

  clean() {
    this.wrongCredential = false;
    this.missingCredential = false;
    this.otherError = false;
    this.error = "";
  }

}
