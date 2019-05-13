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
    //console.log("edit-progress");
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
      //console.log(JSON.parse((<any>data)._body));
    });
  }

  reset() {
    this.frequenza = 0;
    this.progress = 0;
    this.clear();
    this.save();
  }

  enable() {
    this.active = true;
  }

  disable() {
    this.active = false;
  }

}
