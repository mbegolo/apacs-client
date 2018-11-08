import {Component, OnInit, NgModule} from '@angular/core';
import {INglDatatableSort, INglDatatableRowClick} from 'ng-lightning/ng-lightning';

import { User, Exam, Patient } from '../_models';
import { DataService } from '../_services';

@Component({
  selector: 'exam-list',
  templateUrl: './exam-list.component.html',
})

export class ExamListComponent implements OnInit {
  currentUser: User;
  selectedExam: Exam;
  pageDefault: number;
  pageBoundary: number;
  page: number;
  elem = 10;
  
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

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.currentUser = this.dataService.getCurrentUser();
    this.exams = this.dataService.getAllExams();
  }

  // Custom sort function
  onSort($event: INglDatatableSort) {
    const { key, order } = $event;
    this.exams.sort((a: any, b: any) => {
      return (key === 'rank' ? b[key] - a[key] : b[key].localeCompare(a[key])) * (order === 'desc' ? 1 : -1);
    });
  }

  refreshData() {
    this.loadedData = JSON.parse(localStorage.getItem('usersExams'));
    //console.log(this.loadedData);
  }

  editExam($event) {
    if (localStorage.getItem('selectedExam'))
      console.log(this.selectedExam);
  }
/*
  toggleData() {
    this.exams = this.exams ? null : DATA;
  }
  */

  onRowClick($event: INglDatatableRowClick) {
    this.refreshData();
    this.dataService.loadExamById($event.data["_id"]);
    this.selectedExam = this.dataService.getSelectedExam();
    console.log(this.selectedExam);
  }

  onChangePage($event) {
      this.exams = this.loadedData.slice((this.page-1)*this.elem,(this.page)*this.elem);
  }

  changeDisplayElem() {
      this.onChangePage(null);
  }
}