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
  public sesso;
  public eta;
  public data;
  public esaminatore;
  public id;
  public pdf_modal;
  public patient;
  public lateralita;
  public luogonascita;
  public scolarita;
  public professione;
  public diagnosi;
  public altro;
  public nome_esaminatore;
  public generating_pdf = false;
  //public ___;

  constructor(private examService: ExamService, private userService: UserService, private patientService: PatientService) { }

  ngOnInit() {
    this.patient = this.examService.getActiveExam();
    this.totalscore = this.examService.getActiveExam().score;
    this.nome = this.patientService.getActivePatient().nome;
    this.cognome = this.patientService.getActivePatient().cognome;
    this.sesso = this.patientService.getActivePatient().sesso;
    this.eta = this.patientService.getActivePatient().eta;
    this.lateralita = this.patientService.getActivePatient().lateralita;
    this.luogonascita = this.patientService.getActivePatient().luogonascita;
    this.scolarita = this.patientService.getActivePatient().scolarita;
    this.professione = this.patientService.getActivePatient().professione;
    this.diagnosi = this.patientService.getActivePatient().diagnosi;
    this.altro = this.patientService.getActivePatient().altro;
    this.data = this.examService.getActiveExam().date;
    this.esaminatore = this.examService.getActiveExam().user;
    this.id = this.examService.getActiveExam().id;
    var usr = this.userService.getLoggedUser();
    this.nome_esaminatore = usr.name + " " + usr.surname;
  }

  downloadPdf() {
    //console.log(this.examData);
    this.generatePDF();
  }

  public getTitle() {
    var out = "";
    out += this.patientService.getActivePatient().cognome+"_";
    out += this.patientService.getActivePatient().nome+"_";
    console.log(this.patientService.getActivePatient());
    var d = (new Date(this.examService.getActiveExam().date));
    out += d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear();
    return out;
  }

  public generatePDF() { 
    this.generating_pdf = true;
    var page_1 = document.getElementById('content-page-1'); 
    var page_2 = document.getElementById('content-page-2'); 
    var data = document.getElementById('contentToConvert'); 
    let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
    html2canvas(page_1).then(canvas_1 => { 
      // Few necessary setting options 
      var aspRatio = canvas_1.height / canvas_1.width; 
      var imgWidth = 200; 
      var offsetX = 5;
      var offsetY = 10;
      //var pageHeight = 1250; 
      var imgHeight = aspRatio * imgWidth; 
      var heightLeft = imgHeight; 

      const contentDataURL = canvas_1.toDataURL('image/png');
      pdf.addImage(contentDataURL, 'PNG', offsetX, offsetY, imgWidth, imgHeight);
      pdf.addPage();
      html2canvas(page_2).then(canvas_2 => { 
        // Few necessary setting options 
        var aspRatio = canvas_2.height / canvas_2.width; 
        var imgWidth = 200; 
        var offsetX = 5;
        var offsetY = 10;
        //var pageHeight = 1250; 
        var imgHeight = aspRatio * imgWidth; 
        var heightLeft = imgHeight; 

        const contentDataURL = canvas_2.toDataURL('image/png');
        pdf.addImage(contentDataURL, 'PNG', offsetX, offsetY, imgWidth, imgHeight);
        this.generating_pdf = false;
        pdf.save(this.getTitle()); // Generated PDF  
      }); 
      //pdf.save(this.getTitle()); // Generated PDF  
    }); 
  } 

}
