import { Component, OnInit, ElementRef ,ViewChild} from '@angular/core'; 
import * as jspdf from 'jspdf'; 
import html2canvas from 'html2canvas'; 
import { UserService } from '../_services';
import { ExamService } from '../_services';
import { PatientService } from '../_services';

@Component({
  selector: 'app-pdf-export',
  templateUrl: './pdf-export.component.html',
  styleUrls: ['./pdf-export.component.scss']
})
export class PdfExportComponent implements OnInit {

  public title;
  public patient;
  public exam;

  constructor(private examService: ExamService, private patientService: PatientService) { }

  ngOnInit() {
    this.title = this.getTitle();
    console.log(this.title);
    console.log(this.examService.getActiveExamVoices());
  }

  public getTitle() {
    var out = "";
    out += this.patientService.getActivePatient().nome+" ";
    out += this.patientService.getActivePatient().cognome+" - ";
    console.log(this.patientService.getActivePatient());
    var d = (new Date(this.examService.getActiveExam().date));
    out += d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
    return out;
  }

  public generatePDF() { 
    var data = document.getElementById('contentToConvert'); 
    html2canvas(data).then(canvas => { 
      // Few necessary setting options 
      var imgWidth = 208; 
      var pageHeight = 295; 
      var imgHeight = canvas.height * imgWidth / canvas.width; 
      var heightLeft = imgHeight; 

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF 
      var position = 0; 
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('MYPdf.pdf'); // Generated PDF  
    }); 
  } 

}
