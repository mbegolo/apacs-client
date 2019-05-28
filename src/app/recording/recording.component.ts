import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { AudioRecordingService } from '../_services/audio-recording.service';
import { ExamService } from '../_services/exam/exam.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import lame from 'lamejs';
import { Buffer } from 'buffer';




@Component({
  selector: 'app-recording',
  templateUrl: './recording.component.html',
  styleUrls: ['./recording.component.scss']
})
export class RecordingComponent implements OnInit,  OnDestroy {

  private examId;
  private _startRecording = new Subject<string>();
  private _stopRecording = new Subject<string>();
  private deleteAudioModal = false;
  isRecording = false;
  isPaused = false;
  audioConverting = false;
  audioUploading = false;
  recordedTime = "00:00";
  blobUrl;
  blobName;
  blob;

  constructor(private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer, private examService:ExamService) {

    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.blob = data.blob;
      this.blobName = data.title;
      //console.log(this.blobName);
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.blob));
      this.audioConverting = false;
    });

    this.audioRecordingService.isUploading().subscribe(uploading => {
      this.audioUploading = uploading;
    });
  }

  ngOnInit() {
    this.getLastRecording();
  }

  hello() {
    console.log("HELLO");
  }

  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this._startRecording.next();
      this.audioRecordingService.startRecording();
    }
  }

  resumeRecording() {
    if (this.isRecording) {
      this.isPaused = false;
      this.audioRecordingService.resumeRecording();
    }
  }

  continueRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.continueRecording();
    }
  }

  pauseRecording() {    
    if (this.isRecording) {
      this.isPaused = true;
      this.audioRecordingService.pauseRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.examService.setActive(this.examService.getActiveExam().id);
      this.isRecording = false;
      this.audioConverting = true;
      this._stopRecording.next();
    }
  }

  deleteRecordedData() {
    var activeExam = this.examService.getActiveExam();
    if (activeExam.recordings != undefined) {
      var recordingId = (activeExam.recordings[0]);
      this.audioRecordingService.deleteAudio(recordingId).subscribe(data => {
        activeExam.recordings = [];
        this.examService.saveExam(activeExam).subscribe(success => {
          this.examService.setActive(activeExam.id);
          this.blobUrl = null;
          this.deleteAudioModal = false;
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

  setExamId(id) {
    this.examId = id;
    //console.log("Exam ID: ",this.examId);
  }

  getStartEvent(): Observable<string> {
    return this._startRecording.asObservable();
  }

  getStopEvent(): Observable<string> {
    return this._stopRecording.asObservable();
  }

  getLastRecording() {
    var recordingId;
    var recordings = this.audioRecordingService.getExamsRecording();
    if (recordings != undefined) {
      if (recordings[0] != undefined) {
        recordingId = recordings[0];
        console.log("Recording ID: ",recordingId);
        this.audioRecordingService.getRecording(recordingId).subscribe( data => {
          //console.log((<any>data)._body);
          var filename = (JSON.parse((<any>data)._body)).filename;
          this.blobUrl = this.audioRecordingService.getAudioUrlBase() + filename;
        },
        errors => {
          console.log(errors);
        });
      }
    }
  }

  test() {
    this.audioRecordingService.getAllRecordings().subscribe(data => {
      console.log(JSON.parse( (<any>data)._body) );
    });
  }

}