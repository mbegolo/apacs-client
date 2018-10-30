import {Component, OnInit, NgModule} from '@angular/core';
import {INglDatatableSort, INglDatatableRowClick} from 'ng-lightning/ng-lightning';

import { User } from '../_models';
import { Exam } from '../_models';
import { UserService } from '../_services';


@Component({
  selector: 'exam-list',
  templateUrl: './exam-list.component.html',
})

export class ExamListComponent implements OnInit {

  pageDefault: number;
  pageBoundary: number;
  page: number;
  elem = 10;
  actualExam: Exam;
  loadedData: any; 
  total: any;
  exams: any;

  // Initial sort
  sort: INglDatatableSort = { key: 'rank', order: 'asc' };

  // Show loading overlay
  loading = false;

  // Toggle name column
  hideName = false;

  ngOnInit() {
    this.loadedData = JSON.parse(localStorage.getItem('usersExams'));
    console.log(this.loadedData);
    this.total = this.loadedData.length;
    this.exams = this.loadedData.slice(0,this.elem);
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
      console.log(this.actualExam);
  }

  toggleData() {
    this.exams = this.exams ? null : DATA;
  }

  onRowClick($event: INglDatatableRowClick) {
    this.refreshData();
    this.actualExam = $event.data;
    localStorage.setItem('selectedExam', JSON.stringify(this.actualExam));
  }

  onChangePage($event) {
      this.exams = this.loadedData.slice((this.page-1)*this.elem,(this.page)*this.elem);
  }

  changeDisplayElem() {
      this.onChangePage(null);
  }
}