import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../_helpers/must-match.validator';
import { User } from '../_models';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../_services';

@Component({
  selector: 'app-user-component',
  templateUrl: './user-component.component.html',
  styleUrls: ['./user-component.component.scss']
})
export class UserComponentComponent implements OnInit {

  public closeResult: string;
  public logged_user: User;
  public presentation_name: string;
  editUserForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private modalService: NgbModal, private userService: UserService) { }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any) {
    if (reason === ModalDismissReasons.ESC) {
      console.log('Modal dismissed by pressing ESC');
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      console.log('Modal dismissed by clicking on a backdrop');
    } else {
      console.log(`Modal dismissed with: ${reason}`);
    }
  }

  ngOnInit() {
    this.initForm();
    this.logged_user = this.userService.getLoggedUser() as User;
    this.presentation_name = this.logged_user.username;
    if (!(this.logged_user.name === "")) {
      this.presentation_name = this.logged_user.name;
    }
    this.initFormData();
  }

  get f() { return this.editUserForm.controls; }

  initForm() {
    this.editUserForm = this.formBuilder.group({
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

  initFormData() {
    this.editUserForm.controls['username'].setValue(this.logged_user.username);
    this.editUserForm.controls['email'].setValue(this.logged_user.email);
    this.editUserForm.controls['name'].setValue(this.logged_user.name);
    this.editUserForm.controls['surname'].setValue(this.logged_user.surname);
  }

  printData() {
    console.log(this.logged_user);
  }

  onSave() {
    if (!this.save()) this.abort();
    else {
      this.logged_user.username = this.editUserForm.controls.username.value;
      this.logged_user.email = this.editUserForm.controls.email.value;
      this.logged_user.password = this.editUserForm.controls.password.value;
      this.logged_user.name = this.editUserForm.controls.name.value;
      this.logged_user.surname = this.editUserForm.controls.surname.value;
      this.userService.updateUser(this.logged_user).subscribe(data => {
        var new_usr = JSON.parse((<any>data)._body);
        this.userService.logUser(new_usr);
      },
      error => {
        console.log(error);
      })
    }
  }

  save() {
    return confirm("Sicuro di voler salvare? L'azione non è reversibile");
  }

  onAbort() {
    this.abort();
  }

  abort() { }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(data => {
      console.log(this.userService.allUsers);
    });
  }

  logIn() {
    this.userService.logIn("admin","password").subscribe(data => {
      console.log(this.userService.loggedUserID);
    });
  }

  logged() {
    //this.userService.getLoggedUser().subscribe(data => {
      console.log(this.userService.getLoggedUser());
    //})
  }

  print() {
    console.log(this.editUserForm.controls);
  }

  logout() {
    this.userService.logout();
  }

}
