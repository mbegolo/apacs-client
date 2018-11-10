import { Patient } from './patient';

export class Exam {
  nome: string;
  id: string;
  selected: boolean;
  loaded: boolean;
  user: string;
  anagrafica: Patient;
}