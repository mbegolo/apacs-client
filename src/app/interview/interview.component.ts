import { Component, OnInit, ViewChildren, QueryList  } from '@angular/core';
import { InterviewItemComponent } from '../interview-item/interview-item.component';
//import { APIService } from  '../api.service';


@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit {

  @ViewChildren(InterviewItemComponent) children: QueryList<InterviewItemComponent>; 

  registration_on: boolean = false;

  //private all_items: any[];

  private palette;
  private exam;


  all_items: any[] = [
      [
        { id: 0, i: 0, j: 0, nome: 'Errore - Questo componente non esiste' , icona: 'exclamation-triangle', m: true, qv: false, s: false, progress: 0, punteggio: 0, countable: true }, 
      ],
      [
        { id: 11, i: 1, j: 1, nome: "Anomie", icona: 'commenting', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
        { id: 12, i: 1, j: 2, nome: "Agrammatismo", icona: 'comment-o', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
        { id: 13, i: 1, j: 3, nome: "Parafasie fonemiche", icona: 'forumbee', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
        { id: 14, i: 1, j: 4, nome: "Parafasie semantiche", icona: 'indent', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
        { id: 15, i: 1, j: 5, nome: "Circonlocuzioni", icona: 'repeat', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
      ],
      [
        { id: 21, i: 2, j: 1, nome: "Ripetizioni ", icona: 'copy', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
        { id: 22, i: 2, j: 2, nome: "Frasi incomplete", icona: 'times-rectangle', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
        { id: 23, i: 2, j: 3, nome: "Ecolalia", icona: 'feed', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
        { id: 24, i: 2, j: 4, nome: "Coprolalia", icona: 'warning', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
      ],
      [
        { id: 31, i: 3, j: 1, nome: "Difficoltà nelle risposte sì/no", icona: 'map-signs', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
        { id: 32, i: 3, j: 2, nome: "Tendenza ad essere sotto-informativo", icona: 'sort-amount-desc', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
        { id: 33, i: 3, j: 3, nome: "Tendenza ad essere sovra-informativo", icona: 'line-chart', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
        { id: 34, i: 3, j: 4, nome: "Mancanza di iniziativa verbale", icona: 'user-times', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: false },
      ],
      [
        { id: 41, i: 4, j: 1, nome: "Assenza o uso errato di legami coesivi", icona: 'handshake-o', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
        { id: 42, i: 4, j: 2, nome: "Assenza di referenti", icona: 'crosshairs', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
        { id: 43, i: 4, j: 3, nome: "Ordine errato degli elementi", icona: 'list-ul', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
        { id: 44, i: 4, j: 4, nome: "Cambio di argomento ingiustificato", icona: 'exclamation', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
      ],
      [
        { id: 51, i: 5, j: 1, nome: "Velocità di eloquio alterata", icona: 'fast-forward', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: false },
        { id: 52, i: 5, j: 2, nome: "Intonazione alterata", icona: 'volume-up', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: false },
        { id: 53, i: 5, j: 3, nome: "Mancanza contatto visivo", icona: 'eye-slash', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: false },
        { id: 54, i: 5, j: 4, nome: "Espressione facciale fissa", icona: 'meh-o', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: false },
        { id: 55, i: 5, j: 5, nome: "Abuso gesti compensativi", icona: 'signing', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: false },
      ]
    ];


  //constructor(private  apiService:  APIService) { }
  constructor() { }


  ngOnInit() {
    //this.loadData();
    //this.loadPalette();
  }
/*
  loadPalette() {
    this.palette = this.apiService.loadPalette();
  }

  loadData() {
    this.exam = this.apiService.loadExam();
  }

  toggleRegistration() {
    if (this.registration_on) this.stopRegistration();
    else this.startRegistration();
  }

  startRegistration() {
    this.registration_on = !this.registration_on;
    this.enableAll()
  }

  stopRegistration() {
    this.registration_on = !this.registration_on;
    this.disableAll()
  }

  onSubmit() {
    var r = confirm("Stai salvando i dati relativi a questo esame. Sei sicuro di vler continuare?");
    if (r == true) {
      this.saveAll();
    }
  }

  saveAll() {
    //localStorage.clear();
    //console.log("read: "+this.children);
    for (var i=0; i<this.children.length; i++) {
      this.children.forEach(it => it.save());
    }
  }

  enableAll() {
    //alert(this.children.length);
    for (var i=0; i<this.children.length; i++) {
      this.children.forEach(it => it.enable());
    }
  }

  disableAll() {
    for (var i=0; i<this.children.length; i++) {
      this.children.forEach(it => it.disable());
    }
  }

  clearData() {
    var r = confirm("Sei sicuro di voler cancellare tutti i dati?");
    if (r == true) {
      localStorage.clear();
      window.location.reload();
    }
  }
*/

}
