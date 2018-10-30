import {Component, OnInit, NgModule} from '@angular/core';
import {INglDatatableSort, INglDatatableRowClick} from 'ng-lightning/ng-lightning';

const DATA = [
  { rank: 1, name: 'dsa', surname: 'Abdul-Jabbar', points: 1 },
  { rank: 2, name: 'Karl', surname: 'Malone', points: 2 },
  { rank: 3, name: 'Kobe', surname: 'Bryant', points: 3 },
  { rank: 4, name: 'Michael', surname: 'Jordan', points: 4 },
  { rank: 5, name: 'Wilt', surname: 'Chamberlain', points: 5 },
  { rank: 6, name: 'Kareem', surname: 'Abdul-Jabbar', points: 6 },
  { rank: 7, name: 'Karl', surname: 'Malone', points: 7 },
  { rank: 8, name: 'Kobe', surname: 'Bryant', points: 8 },
  { rank: 9, name: 'Michael', surname: 'Jordan', points: 9 },
  { rank: 10, name: 'Wilt', surname: 'Chamberlain', points: 10 },
  { rank: 11, name: 'Kareem', surname: 'Abdul-Jabbar', points: 11 },
  { rank: 12, name: 'Karl', surname: 'Malone', points: 12 },
  { rank: 13, name: '456789123', surname: 'ygu', points: 13 },
  { rank: 14, name: 'Michael', surname: 'poipoipoi', points: 14 },
  { rank: 15, name: 'Wilt', surname: 'Chamberlain', points: 15 },
  { rank: 16, name: '$$$$$$$$$$$$$$', surname: 'Abdul-Jabbar', points: 38387 },
  { rank: 17, name: 'Karl', surname: '77777777777777', points: 36928 },
  { rank: 18, name: 'Kobe', surname: 'Bryant', points: 33643 },
  { rank: 19, name: '22222', surname: 'Jordan', points: 32292 },
  { rank: 20, name: 'Wilt', surname: 'Chamberlain', points: 31419 },
  { rank: 21, name: 'rrrrrr', surname: 'Abdul-Jabbar', points: 38387 },
  { rank: 22, name: 'Karl', surname: 'Malone', points: 36928 },
  { rank: 23, name: 'Kobe', surname: 'Bryant', points: 33643 },
  { rank: 24, name: 'Michael', surname: 'Jordan', points: 32292 },
  { rank: 25, name: 'yyyyy', surname: 'hgfyv', points: 31419 },
  { rank: 26, name: 'Kareem', surname: 'Abdul-Jabbar', points: 38387 },
  { rank: 27, name: '555555555555', surname: 'Malone', points: 36928 },
  { rank: 28, name: 'Kobe', surname: 'dsa', points: 33643 },
  { rank: 29, name: 'Michael', surname: 'Jordan', points: 32292 },
  { rank: 30, name: 'llllllllllllllllll', surname: 'Chamberlain', points: 31419 },
  { rank: 31, name: 'Kareem', surname: 'Abdul-Jabbar', points: 38387 },
  { rank: 32, name: 'hkjlòòòò', surname: 'Malone', points: 36928 },
  { rank: 33, name: '6666666666666666', surname: 'Bryant', points: 33643 },
  { rank: 34, name: 'Michael', surname: 'Jordan', points: 32292 },
  { rank: 35, name: 'Wilt', surname: 'hhhhhhhhhhhhhhhhhh', points: 31419 },
  { rank: 36, name: 'Kareem', surname: 'Abdul-Jabbar', points: 38387 },
  { rank: 37, name: 'Karl', surname: 'Malone', points: 36928 },
  { rank: 38, name: 'Kobe', surname: '555555555555555', points: 33643 },
  { rank: 39, name: 'Michael', surname: 'Jordan', points: 32292 },
  { rank: 40, name: 'Wilt', surname: 'Chamberlain', points: 31419 },
  { rank: 41, name: 'Kareem', surname: 'Abdul-Jabbar', points: 38387 },
  { rank: 42, name: 'dddddddddddd', surname: 'Malone', points: 36928 },
  { rank: 43, name: 'Kobe', surname: 'Bryant', points: 33643 },
  { rank: 44, name: 'Michael', surname: 'jjjjjjjjjjjjjjjj', points: 32292 },
  { rank: 45, name: 'ggggggggggggg', surname: 'Chamberlain', points: 31419 },
  { rank: 46, name: 'Kareem', surname: 'Abdul-Jabbar', points: 38387 },
  { rank: 47, name: 'Karl', surname: 'Malone', points: 36928 },
  { rank: 48, name: 'hhhhhhhhhhhhhhhh', surname: 'Bryant', points: 33643 },
  { rank: 49, name: 'Michael', surname: 'Jordan', points: 32292 },
  { rank: 50, name: 'Wilt', surname: 'Chamberlain', points: 31419 },
];

@Component({
  selector: 'exam-list',
  templateUrl: './exam-list.component.html',
})

export class ExamListComponent implements OnInit {
  

  pageDefault: number;
  pageBoundary: number;
  page: number;
  elem = 10;

  loadedData = DATA;
  total = this.loadedData.length;
  data = this.loadedData.slice(0,this.elem);

  // Initial sort
  sort: INglDatatableSort = { key: 'rank', order: 'asc' };

  // Show loading overlay
  loading = false;

  // Toggle name column
  hideName = false;

  ngOnInit() {
      
  }

  // Custom sort function
  onSort($event: INglDatatableSort) {
    const { key, order } = $event;
    this.data.sort((a: any, b: any) => {
      return (key === 'rank' ? b[key] - a[key] : b[key].localeCompare(a[key])) * (order === 'desc' ? 1 : -1);
    });
  }

  toggleData() {
    this.data = this.data ? null : DATA;
  }

  onRowClick($event: INglDatatableRowClick) {
    console.log('clicked row', $event.data);
  }

/*
  onChangePage($event: EventEmitter<number>) {
      this.data = this.loadedData.slice(this.page-1,this.page-1+10);
  }
  */
  onChangePage($event) {
      this.data = this.loadedData.slice((this.page-1)*this.elem,(this.page)*this.elem);
  }

  changeDisplayElem() {
      this.onChangePage(null);
  }
}