import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../_services';
import { ExamService } from '../_services';
import { PatientService } from '../_services';
import { Exam,ExamVoice} from '../_models';

//import { ITEMS } from '../mock-items';

@Component({
  selector: 'app-interview-item',
  templateUrl: './interview-item.component.html',
  styleUrls: ['./interview-item.component.scss']
})

export class InterviewItemComponent implements OnInit {


  //@Input() col: number;
  @Input() itemid: string;
  @Input() active: boolean = true;

  loaded: boolean = false;
  item: ExamVoice;

  id: string;
  form: string;
  stile: string;
  nome:string;
  countable: boolean;
  m: boolean;
  qv: boolean;
  s: boolean;
  punteggio: number;
  frequenza: number;
  progress: number = 0;
  min: number = 0;
  max: number = 20;
  obj: any[];
  //all_items: any[];

/*
  all_items: any[] = [
      [
        { id: 0, i: 0, j: 0, nome: 'Errore - Questo componente non esiste' , icona: 'exclamation-triangle', m: true, qv: false, s: false, progress: 0, punteggio: 0, countable: true }, 
      ],
      [
        { id: 11, i: 1, j: 1, nome: "Anomie", icona: 'chat-bubble', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
        { id: 12, i: 1, j: 2, nome: "Agrammatismo", icona: 'bubble-exclamation', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
        { id: 13, i: 1, j: 3, nome: "Parafasie fonemiche", icona: 'bubble-chart', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
        { id: 14, i: 1, j: 4, nome: "Parafasie semantiche", icona: 'shuffle', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
        { id: 15, i: 1, j: 5, nome: "Circonlocuzioni", icona: 'refresh', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
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
        { id: 44, i: 4, j: 4, nome: "Cambio di argomento ingiustificolo", icona: 'exclamation', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: true },
      ],
      [
        { id: 51, i: 5, j: 1, nome: "Velocità di eloquio alterata", icona: 'fast-forward', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: false },
        { id: 52, i: 5, j: 2, nome: "Intonazione alterata", icona: 'volume-up', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: false },
        { id: 53, i: 5, j: 3, nome: "Mancanza contatto visivo", icona: 'eye-slash', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: false },
        { id: 54, i: 5, j: 4, nome: "Espressione facciale fissa", icona: 'meh-o', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: false },
        { id: 55, i: 5, j: 5, nome: "Abuso gesti compensativi", icona: 'signing', m: true, qv: false, s: false, progress: 0, punteggio: 2, countable: false },
      ]
    ];
*/

  constructor(private userService:UserService,
    private examService:ExamService,
    private patientService:PatientService) { }

  ngOnInit() {
    var v_data;
    this.examService.getExamVoiceData(this.itemid).subscribe(_data => {
      v_data = JSON.parse((<any>_data)._body);
      //console.log(voice.voice_id,this.voiceid);
      //this.item = v_data as ExamVoice;
      //console.log((<any>this.item).voiceid);
      this.examService.loadVoice((<any>v_data).voiceid).subscribe(_voice => {
        //console.log(JSON.parse((<any>_voice)._body), (<any>this.item).voiceid);
        var voice = JSON.parse((<any>_voice)._body);
        var d = new Array<any>();
        var v = new Array<any>();
        d.push(v_data);
        v.push(voice);
        //console.log(this.examService.merge(d,v)[0]);
        this.item = this.examService.merge(d,v)[0] as ExamVoice;
        this.m=this.item.m;
        this.qv=this.item.qv;
        this.s=this.item.s;
        this.nome=this.item.nome;
        this.punteggio=this.item.punteggio;
        this.frequenza= 2 - this.punteggio;
        this.progress=this.item.progress;
        this.countable=this.item.countable;
        this.stile = (this.progress)/(this.max)*100+"%";
        this.loaded = true;
      });

    });
    //console.log(voice,this.itemid);
    /*.subscribe(_voice => {
      var voice = JSON.parse((<any>_voice)._body);
      */
      //console.log(voice);
    //while ( !voice ) {
    //  console.log("data not received");
    //}
    //if (voice) {
      //console.log(voice);

    //}
    //else {
    //  console.log("item is empty");
    //}
      //console.log(this.item.punteggio);
    /*
    // ADJUST item index
    this.item = this.item - 1;

    // Control CAT and ITEM indexes
    if ( (this.col < 1) || (this.col > 5) ) {
      this.col = 0;
      this.item = 0;
    }
    if ( (this.item < 0) || ( this.item > 4 )) {
      this.col = 0;
      this.item = 0;
    }
    if ( !( ( this.col == 1 ) || ( this.col == 5 ) ) && (this.item == 4) ) {
      this.col = 0;
      this.item = 0;
    }
    this.id = this.col+""+(this.item+1);

    // LOAD DATA
    var load = localStorage.getItem('exam'+this.id);
    //this.all_items = this.all_items_default;
    if (load != null) {
      this.item = JSON.parse(load);
      console.log("Saved data loaded ");
    }
    else {
      console.log("default data loaded");
    }
    */
/*
    // Update actual item to saved values
    this.m=this.item.m;
    this.qv=this.item.qv;
    this.s=this.item.s;
    this.nome=this.item.nome;
    this.punteggio=this.item.punteggio;
    this.frequenza= 2 - this.punteggio;
    this.progress=this.item.progress;
    this.countable=this.item.countable;
    this.stile = (this.progress)/(this.max)*100+"%";
    //console.log(this.item.punteggio);
    */
  }

  onClickItem() {
    if (this.active) {
      if (this.countable) {
        this.editProgress(+1);
      }
      else {
        this.increaseSlider();
      }
    }
    this.clear();
  }

  undo() {
    if (this.active) {
      if (this.countable) {
        this.editProgress(-2);
      }
      else {
        this.decreaseSlider();
        this.decreaseSlider();
      }
    }
    //this.clear();
  }

  editProgress(n:number):void {
    console.log("edit-progress");
    this.progress += n;
    this.stile = (this.progress)/(this.max)*100+"%";
  }

  changeVal(e) {
    if (this.active && !this.countable) {
      this.frequenza = e.target.value;
      this.decreaseSlider();
    }
    else if (!this.active) {
      e.target.value = this.frequenza;
    }
  }

  increaseSlider() {
    this.frequenza++;
    this.punteggio--;
  }

  decreaseSlider() {
    this.frequenza--;
    this.punteggio++;
  }

  clear() {
    if (this.countable) {
      if (this.progress < this.min) 
        this.progress = this.min;
      if (this.progress > this.max)
        this.progress = this.max
      if (this.progress > 5 ) {
        this.punteggio = 0;
        this.frequenza = 2;
        this.s = true, this.m = false, this.qv = false;
      }
      else if (this.progress > 0 ) {
        this.punteggio = 1;
        this.frequenza = 1;
        this.s = false, this.m = false, this.qv = true;
      }
      else if (this.progress <= 0) {
        this.punteggio = 2;
        this.frequenza = 0;
        this.s = false, this.m = true, this.qv = false;
      }
    }

    else {
      if (this.frequenza > 2) {
        this.frequenza = 2;
        this.punteggio = 0;
      }
      else if (this.frequenza < 0) {
        this.frequenza = 0;
        this.punteggio = 2;
      }
      if (this.frequenza == 2) this.s = true, this.m = false, this.qv = false, this.punteggio=0;
      if (this.frequenza == 1) this.s = false, this.m = false, this.qv = true, this.punteggio=1;
      if (this.frequenza == 0) this.s = false, this.m = true, this.qv = false, this.punteggio=2;
    }
  }

  save() {
    //console.log(this.progress);
    var to_upload = {
      "m":this.m,
      "qv":this.qv,
      "s":this.s,
      "punteggio": this.punteggio,
      "progress": this.progress,
      "examid": this.item.exam_id,
      "voiceid": this.item.voice_id
    };
    //console.log(to_upload);
    localStorage.setItem('exam'+this.id, JSON.stringify(this.item));
    this.examService.saveExamData(this.item.id, to_upload).subscribe(data => {
      console.log(JSON.parse((<any>data)._body));
    });
  }

  enable() {
    this.active = true;
  }

  disable() {
    this.active = false;
  }

}
