import {Component, OnInit, OnChanges, NgModule} from '@angular/core';
import {INglDatatableSort, INglDatatableRowClick} from 'ng-lightning/ng-lightning';

import { Router } from '@angular/router';

import { User, Exam, Patient } from '../_models';
import { DataService } from '../_services';

@Component({
  selector: 'exam-list',
  templateUrl: './exam-list.component.html',
})

export class ExamListComponent implements OnInit, OnChanges {
  currentUser: User;
  selectedExam: Exam;
  pageDefault: number;
  pageBoundary: number;
  page: number;
  elem = 10;
  edit_clicked: boolean;
  delete_clicked: boolean;
  
  loadedData: any; 
  total: any;
  exams: Exam[];

  out: string;

  // Initial sort
  sort: INglDatatableSort = { key: 'rank', order: 'asc' };

  // Show loading overlay
  loading = false;

  // Toggle name column
  hideName = false;

  constructor(private dataService: DataService, private router:Router) { }

  ngOnInit() {
    this.reload();
  }

  ngOnChanges() {
    this.reload();
  }

  // Custom sort function
  onSort($event: INglDatatableSort) {
    const { key, order } = $event;
    this.exams.sort((a: any, b: any) => {
      return (key === 'rank' ? b[key] - a[key] : b[key].localeCompare(a[key])) * (order === 'desc' ? 1 : -1);
    });
  }

  reload() {
    this.currentUser = this.dataService.getCurrentUser();
    this.exams = this.dataService.getAllExams();
    this.total = this.exams.length;
    this.refreshData();
  }

  refreshData() {
    this.loadedData = JSON.parse(localStorage.getItem('usersExams'));
    this.router.navigate(['./']);
  }

  editExam($event) {
    this.edit_clicked = true;
  }

  onRowClick($event: INglDatatableRowClick) {
    var edit_clicked = false;
    var delete_clicked = false;
    if (this.edit_clicked) {
      edit_clicked = true;
      this.edit_clicked = false;
    }
    if (this.delete_clicked) {
      delete_clicked = true;
      this.delete_clicked = false;
    }
    console.log("function onRowClick()");
    this.refreshData();
    this.dataService.loadExamById($event.data["_id"]);
    this.selectedExam = this.dataService.getSelectedExam();
    console.log(this.selectedExam);
    console.log($event);
    if (edit_clicked) {
      //alert("Edit " + $event.data["_id"]);
      this.router.navigate(['./editExam']);
    }
    if (delete_clicked) {
      alert("sicuro?");
      this.dataService.deleteExam($event.data["id"]);
      this.router.navigate(['./']);
    }
  }

  onChangePage($event) {
      this.exams = this.loadedData.slice((this.page-1)*this.elem,(this.page)*this.elem);
  }

  changeDisplayElem() {
      this.onChangePage(null);
  }

  deleteExam($event) {
    this.delete_clicked = true;
  }
}