export class Patient {
  id: string;
  nome: string;
  cognome: string;
  sesso: string;
  eta: number;
  lateralita: string;
  luogonascita: string;
  professione: string;
  scolarita: number;
  lingua: string;
  altro: string;
  diagnosi: string;
  data: string;
  esaminatore: string;
  esame: string;

  constructor() {
    this.nome = "_name_";
    this.cognome = "_surname_";
  }

  isValid(): boolean {
    if (this.nome && this.cognome && this.sesso && this.eta && this.lateralita && this.diagnosi) return true;
    return false;
  }
}