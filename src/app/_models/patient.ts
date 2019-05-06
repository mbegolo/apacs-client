export class Patient {
  id: string;
  nome: string;
  cognome: string;
  sesso: boolean;
  eta: number;
  lateralita: boolean;
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
    this.nome = " ";
    this.cognome = " ";
    this.sesso = null;
    this.eta =10;
    this.lateralita = null;
    this.luogonascita ="";
    this.professione ="";
    this.scolarita =0;
    this.lingua ="";
    this.altro ="";
    this.diagnosi ="";
    this.data ="";
    this.esaminatore ="";
    this.esame ="";
  }

  isValid(): boolean {
    if (this.nome && this.cognome && this.sesso && this.eta && this.lateralita && this.diagnosi) return true;
    return false;
  }
}