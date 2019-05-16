import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as RecordRTC from 'recordrtc';
import * as moment from 'moment';
import { isNullOrUndefined } from 'util';
import lame from 'lamejs';

interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}

@Injectable()
export class AudioRecordingService {

  private stream;
  private recorder;
  private interval;
  private startTime;
  private buffer;
  private paused: boolean = false;
  private totalTime;
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
  };


  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this._recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }

  //constructor(private ac:AudioConverter) {
  //}

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
      console.log(s);
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
          //this._recorded.next({ blob: this.convertAudio(), title: mp3Name });
          //this._recorded.next({ blob: blob, title: mp3Name });


          /*

          var arrayBuffer;
          var fileReader = new FileReader();
          fileReader.onload = function(event) {
              arrayBuffer = (<any>event.target).result;
          };
          var out = fileReader.readAsArrayBuffer(blob);
          console.log(out);
          */

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
    
    console.log("pause @ ",this._recordingTime.next());
  }

  resumeRecording() {
    this.startTime = moment();
    this.paused = false;
    this.recorder.resume();
    
    console.log("resume @ ",this._recordingTime.next());
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
    console.log(this.buffer);
    var samples = new Int16Array(this.buffer);
    console.log(samples);
    var mp3Tmp = mp3encoder.encodeBuffer(samples); //encode mp3
    mp3Data.push(mp3Tmp);
    mp3Tmp = mp3encoder.flush();
    mp3Data.push(mp3Tmp);
    var blob = new Blob(mp3Data, {type: 'audio/mp3'});
    //var url = window.URL.createObjectURL(blob);
    return blob;
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

}