import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pdf-resume',
  templateUrl: './pdf-resume.component.html',
  styleUrls: ['./pdf-resume.component.scss']
})
export class PdfResumeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  downloadPdf() {
    console.log("DOWNLOAD PDF");
  }

}
