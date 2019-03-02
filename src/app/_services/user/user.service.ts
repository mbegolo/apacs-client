import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Router } from "@angular/router";
import { User } from '../../_models/';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public allUsers: User[];
  public loggedUserID: string;
  public loggedUser: User;

  constructor(private router:Router, private http: Http ) { }

  public getAllUsers(): Observable<User[]> {
    return this.http.get(API_URL + '/user').pipe(
      map(response => {
        this.allUsers = response.json().map((data) => new User());
        return this.allUsers;
      })
    );
  }

  public getUser(uid: string) {
    //console.log("user.service's getUser()");
    return this.http.get(API_URL + '/user/' + uid);
  }

  public updateUser(u: User) {
    return this.http.put(API_URL + '/user/' + u.id, u);
  }

  public logIn(u:string, p:string) {
    var request_body = { username: u, password: p};
    return this.http.post(API_URL + '/user/login', request_body);
  }

  public register(u: User) {
    return this.http.post(API_URL + '/user', u);
  }

  public logUser(u: User) {
    this.loggedUser = u;
    this.loggedUserID = u.id;
    this.saveOnLocal();
  }

  public getLoggedUser() {
    this.loadFromLocal();
    //if (this.loggedUserID != null) {
      return this.loggedUser;
    //}
    //else {
      //return false;
    //}
  }

  public saveOnLocal() {
    if (this.loggedUser!=null)
      localStorage.setItem('currentUser', JSON.stringify(this.loggedUser));
    else return false;
  }

  public loadFromLocal() {
    var data = localStorage.getItem('currentUser');
    if (data) {
      this.loggedUser = JSON.parse(data);
      this.loggedUserID = this.loggedUser.id;
      return true;
    }
    else return false;
  }

  public logout() {
    this.loggedUser = null;
    this.loggedUserID = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('activePatient');
    localStorage.removeItem('activeExam');
  }

  public isUserLogged() {
    return this.loadFromLocal();
  }
}

