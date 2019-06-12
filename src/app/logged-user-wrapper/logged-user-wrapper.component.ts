import { Component, OnInit } from '@angular/core';

import { UserService } from '../_services';
import { Router } from "@angular/router";

@Component({
  selector: 'app-logged-user-wrapper',
  templateUrl: './logged-user-wrapper.component.html',
  styleUrls: ['./logged-user-wrapper.component.scss']
})
export class LoggedUserWrapperComponent implements OnInit {

  public basic = false;
  public logged = false;

  constructor(private router:Router, private userService: UserService) { }

  ngOnInit() {
    //this.router.navigate(['main',{ outlets: { logged: ['dashboard'] } }]);
    this.checkUser();
  }

  checkUser() {
    //console.log("is user logged? ",this.userService.isUserLogged());
    if (!this.userService.isUserLogged()) {
      this.router.navigate(['login']);
    }
    else this.logged = true;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['login']);
  }

}
