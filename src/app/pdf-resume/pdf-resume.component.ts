import { Component, OnInit, Input, ElementRef ,ViewChild} from '@angular/core'; 
import * as jspdf from 'jspdf'; 
import html2canvas from 'html2canvas'; 
import { UserService } from '../_services';
import { ExamService } from '../_services';
import { PatientService } from '../_services';

@Component({
  selector: 'app-pdf-resume',
  templateUrl: './pdf-resume.component.html',
  styleUrls: ['./pdf-resume.component.scss']
})

export class PdfResumeComponent implements OnInit {

  @Input() examData: any;
  @Input() groups: any;
  public totalscore;
  public nome;
  public cognome;
  public data;
  public esaminatore;
  public id;
  public pdf_modal;

  constructor(private examService: ExamService, private patientService: PatientService) { }

  ngOnInit() {
    this.totalscore = this.examService.getActiveExam().score;
    this.nome = this.patientService.getActivePatient().nome;
    this.cognome = this.patientService.getActivePatient().cognome;
    this.data = this.examService.getActiveExam().date;
    this.esaminatore = this.examService.getActiveExam().user;
    this.id = this.examService.getActiveExam().id;
    //console.log(this.totalscore);
  }

  downloadPdf() {
    //console.log(this.examData);
    this.generatePDF();
  }

  public getTitle() {
    var out = "";
    out += this.patientService.getActivePatient().cognome+"_";
    out += this.patientService.getActivePatient().nome+"_";
    var d = (new Date(this.examService.getActiveExam().date));
    out += d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear();
    return out;
  }

  public generatePDF() { 
    var data = document.getElementById('contentToConvert'); 
    html2canvas(data).then(canvas => { 
      // Few necessary setting options 
      var aspRatio = canvas.height / canvas.width; 
      var imgWidth = 200; 
      var offsetX = 5;
      var offsetY = 10;
      //var pageHeight = 1250; 
      var imgHeight = aspRatio * imgWidth; 
      var heightLeft = imgHeight; 

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF 
      pdf.addImage(contentDataURL, 'PNG', offsetX, offsetY, imgWidth, imgHeight);
      pdf.save(this.getTitle()); // Generated PDF  
      //console.log(canvas.width,canvas.height);
    }); 
  } 

}
