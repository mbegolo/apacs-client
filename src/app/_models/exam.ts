import { User } from './user';

export class Exam {
  id: string;
  date: Date;
  user: any[];
  patient: object;
  voices: any[];
  recordings: any[];
  score: number;

  constructor(d: Date, uid:any, pid:string) {
    this.date = d;
    this.user = [uid];
    this.patient = {"id":pid};
    this.score = 44;
  }
}