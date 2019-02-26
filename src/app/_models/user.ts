export class User {
  id: string;
  username: string;
  password: string;
  name: string;
  surname: string;
  email: string;


  constructor() {
    this.id = "_ID_";
    this.username = "_USERNAME_";
    this.password = "_PASSWORD_";
    this.email = "_EMAIL_";
    this.name = "_NAME_";
    this.surname = "_SURNAME_";
  }

  isValid(): boolean {
    if (this.id && this.username && this.password && this.email) return true;
    return false;
  }
}