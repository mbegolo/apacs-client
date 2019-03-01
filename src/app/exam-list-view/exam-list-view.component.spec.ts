import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamListViewComponent } from './exam-list-view.component';

describe('ExamListViewComponent', () => {
  let component: ExamListViewComponent;
  let fixture: ComponentFixture<ExamListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
