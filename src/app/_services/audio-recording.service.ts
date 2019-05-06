import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as RecordRTC from 'recordrtc';
import * as moment from 'moment';
import { isNullOrUndefined } from 'util';

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
    console.log(this.recorder);
    /*
    navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
      this.stream = s;
      this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
        type: 'audio',
        mimeType: 'audio/webm'
      });
      this.startTime = moment();
      this.record();
    }).catch(error => {
      this._recordingFailed.next();
    });
    */
    this.startTime = moment();
    this.record();
  }

  stopRecording() {
    if (this.recorder) {
      if (this.paused) this.resumeRecording();
      this.recorder.stop((blob) => {
        if (this.startTime) {
          const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.mp3');
          this.stopMedia();
          this._recorded.next({ blob: blob, title: mp3Name });
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