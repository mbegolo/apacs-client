import { User } from './user';

export class Exam {
  id: string;
  date: Date;
  user: any[];
  patient: any[];
  voices: any[];
  recordings: any[];

  constructor(d: Date, uid:any) {
    this.date = d;
    this.user = [uid];
  }
}