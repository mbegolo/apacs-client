import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MustMatch } from '../_helpers/must-match.validator';
import { User } from '../_models';
import { UserService } from '../_services';
import { Router } from "@angular/router";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})

export class RegisterFormComponent implements OnInit {
    registerForm: FormGroup;
    submitted = false;

    new_user: User;

    constructor(private formBuilder: FormBuilder, private userService: UserService, private router:Router) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            name: [''],
            surname: [''],
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        this.mapFromForm(this.registerForm.value);
        this.askForRegistration(this.new_user);
    }

    mapFromForm(form_data) {
      this.new_user = new User();
      this.new_user.username = form_data.username;
      this.new_user.password = form_data.password;
      this.new_user.email = form_data.email;
      this.new_user.name = form_data.name;
      this.new_user.surname = form_data.surname;
      this.new_user.id = null;
    }

    askForRegistration(u: User) {
      console.log("asking to register user: ", u);
      this.userService.register(u).subscribe(data => {
        console.log("registered user: ", data);
        this.userService.logIn(u.username, u.password).subscribe(response => {
          var new_id = (JSON.parse((<any>response)._body)).uid;
          //console.log(new_id);
          this.userService.getUser(new_id).subscribe( answ => {
            var usr = JSON.parse((<any>answ)._body) as User;
            this.userService.logUser(usr);
            this.router.navigate(['']);
          });
        })
      },
      error => {
        console.log(JSON.parse((<any>error)._body));
        var msg = JSON.stringify(JSON.parse((<any>error)._body).errors);
        alert(msg);
      });
    }
}