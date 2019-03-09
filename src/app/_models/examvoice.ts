import { User } from './user';
import { Exam } from './exam';

export class ExamVoice {
  id: string;
  voice_id: string;
  exam_id: string;
  nome: string;
  icona: string;
  gruppo: number;
  riga: number;
  countable: boolean;
  treshold1: number;
  treshold2: number;
  m: boolean;
  qv: boolean;
  s: boolean;
  punteggio: number;
  progress: number;

  constructor(data: any, voice: any) {
    this.voice_id=data.voiceid;
    this.exam_id=data.examid;
    this.id = data.id;
    this.nome = voice.nome;
    this.icona = voice.icona;
    this.gruppo = voice.gruppo;
    this.riga = voice.riga;
    this.countable = voice.countable;
    this.treshold1 = voice.treshold1;
    this.treshold2 = voice.treshold2;
    this.m = data.m;
    this.qv = data.qv;
    this.s = data.s;
    this.punteggio = data.punteggio;
    this.progress = data.progress;
  }
}