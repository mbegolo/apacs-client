import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ExamService } from './exam/exam.service';
import * as RecordRTC from 'recordrtc';
import * as moment from 'moment';
import { isNullOrUndefined } from 'util';

import lame from 'lamejs';

const API_URL = environment.apiUrl;

interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}

@Injectable()
export class AudioRecordingService {

  private audioAPI = "http://localhost:9001";
  private stream;
  private recorder;
  private interval;
  private startTime;
  private buffer;
  private paused: boolean = false;
  private totalTime;
  private activeExam;
  private blob;
  private _uploading = new Subject<boolean>();
  private _recorded = new Subject<any>();
  private _recordingTime = new Subject<string>();
  private _recordingFailed = new Subject<string>();


  private mediaOptions = {
    type: 'audio',
    mimeType: 'audio/webm',
    numberOfAudioChannels: 1,
    bufferSize: 256,
    sampleRate: 22050//, 
    //desiredSampRate: 16000
  }

  getActiveExam() {
    return this.examService.getActiveExam();
  }

  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this._recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }

  isUploading(): Observable<boolean> {
    return this._uploading.asObservable();
  }

  constructor(private http: Http, private sanitizer: DomSanitizer, private examService: ExamService) {
    this.activeExam = this.examService.getActiveExam();
  }

  startRecording() {
    this.startNewRecording();
  }

  startNewRecording() {
    if (this.recorder) { 
      return;
    }
    this._recordingTime.next('00:00');
    this.totalTime = moment.duration((moment()).diff(moment()));
    navigator.mediaDevices.getUserMedia({audio: true}).then(s => {
      //console.log(s);
      this.stream = s;
      //this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, this.mediaOptions);
      this.startTime = moment();
      this.record();
    }).catch(error => {
      this._recordingFailed.next();
    });
  }

  continueRecording() {
    if (this.recorder) { 
      return;
    }
    const time = this.toString(this.totalTime.minutes()) + ':' + this.toString(this.totalTime.seconds());
    this._recordingTime.next(time);
    this.startTime = moment();
    this.record();
  }

  stopRecording() {
    if (this.recorder) {
      if (this.paused) this.resumeRecording();
      this.recorder.stop((blob) => {
        if (this.startTime) {
          const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.mp3');
          this.buffer = this.recorder.buffer;
          //var prova = new Int16Array(this.buffer);
          this.stopMedia();
          fetch(URL.createObjectURL(blob)).then(res => {
            res.arrayBuffer().then(data => {
              this.buffer = data;
              this._recorded.next({ blob: this.convertAudio(), title: mp3Name });
            });
          });
        }
      }, () => {
        this.stopMedia();
        this._recordingFailed.next();
      });
    }
  }

  abortRecording() {
    this.stopMedia();
  }

  pauseRecording() {
    this.paused = true;
    this.recorder.pause();
    this.totalTime = (moment.duration((moment()).diff(this.startTime))).add(this.totalTime);
    const time = this.toString(this.totalTime.minutes()) + ':' + this.toString(this.totalTime.seconds());
    this._recordingTime.next(time);
    
    //console.log("pause @ ",this._recordingTime.next());
  }

  resumeRecording() {
    this.startTime = moment();
    this.paused = false;
    this.recorder.resume();
    
    //console.log("resume @ ",this._recordingTime.next());
  }

  getBuffer() {
    return this.buffer;
  }

  private record() {
    this.recorder.record();
    this.interval = setInterval(
      () => {
        if (!this.paused) {
          const currentTime = moment();
          //const diffTime = moment.duration(currentTime.diff(this.startTime));
          const diffTime = (moment.duration(currentTime.diff(this.startTime))).add(this.totalTime);
          const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
          this._recordingTime.next(time);
        }
      },
      1000
    );
  }

  private stopMedia() {
    this.paused = false;
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => track.stop());
        this.stream = null;
      }
    }
  }

  private convertAudio() {
    var mp3Data = [];
    var mp3encoder = new lame.Mp3Encoder(1, 44100, 64); //mono 44.1khz encode to 128kbps
    //console.log(this.buffer);
    var samples = new Int16Array(this.buffer);
    //console.log(samples);
    var mp3Tmp = mp3encoder.encodeBuffer(samples); //encode mp3
    mp3Data.push(mp3Tmp);
    mp3Tmp = mp3encoder.flush();
    mp3Data.push(mp3Tmp);
    //console.log(mp3Data)
    this.blob = new Blob(mp3Data, {type: 'audio/mp3'});
    //console.log(this.buffer);
    this.uploadAudio(this.blob,"audio_"+this.activeExam.id+".mp3",new Date());
    //var url = window.URL.createObjectURL(blob);
    return this.blob;
  }

  private toString(value) {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  test() {
    this.http.get(API_URL + '/fileupload/').subscribe(result => {
        console.log(JSON.parse((<any>result)._body));
    });
  }

  getAllRecordings() {
    return this.http.get(API_URL + '/fileupload/');
  }

  getRecording(rid) {
    return this.http.get(API_URL + '/fileupload/' + rid);
  }

  getAudioUrlBase() {
    return API_URL + '/uploads/';
  }

  getExamsRecording() {
    this.activeExam = this.examService.getActiveExam();
    return this.activeExam.recordings;
    /*
    var baseUrl = API_URL + '/uploads/';
    if (this.activeExam.recordings != undefined)
      return baseUrl + this.activeExam.recordings[0];
    else return undefined;
    */
    //console.log(this.activeExam);
  }

  deleteAudio(rid) {
    return this.http.delete(API_URL + '/fileupload/' + rid)
  }

  getAudioFile(filename) {
    var xhr = new XMLHttpRequest();
    var _url = API_URL + '/fileupload/' + filename;
    var newUrl;
    xhr.open('GET', _url);
    xhr.responseType = 'blob';
    xhr.send();
    return xhr.onreadystatechange;
  }

  getGeneral(url) {
    return this.http.get(url);
  }

  uploadAudio(blob, filename, date) {
    this._uploading.next(true);
    //console.log(filename);
    var file = new File([blob], filename);
    var formData: FormData = new FormData();
    //console.log(formData);
    formData.append('file', file);
    // POST
    this.http.post(API_URL + '/fileupload/', formData).subscribe(result => {
      var fileId = (<any>(JSON.parse((<any>result)._body))[0]).id;
      //console.log(fileId);
      this.examService.addNewRecording(this.activeExam.id, fileId).subscribe(
        response => {
          //console.log(response);
          this.examService.setActive(this.activeExam.id);
          this._uploading.next(false);
        },
        errors => console.log(errors)
      );
    });

  }

}