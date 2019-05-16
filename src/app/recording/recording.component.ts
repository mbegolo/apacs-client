import { Component, OnInit, OnDestroy } from '@angular/core';
import { AudioRecordingService } from '../_services/audio-recording.service';
import { DomSanitizer } from '@angular/platform-browser';
import lame from 'lamejs';
//import btb from 'blob-to-buffer';


@Component({
  selector: 'app-recording',
  templateUrl: './recording.component.html',
  styleUrls: ['./recording.component.scss']
})
export class RecordingComponent implements OnInit,  OnDestroy {

  isRecording = false;
  isPaused = false;
  audioConverting = false;
  recordedTime = "00:00";
  blobUrl;
  blobName;
  blob;

  constructor(private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer) {

    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.blob = data.blob;
      this.blobName = data.title;
      console.log(this.blobName);
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      this.audioConverting = false;
    });
  }

  ngOnInit() {
  }

  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
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
      this.isRecording = false;
      this.audioConverting = true;
    }
  }

  clearRecordedData() {
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

  print() {
    console.log(this.blobUrl);
  }

}