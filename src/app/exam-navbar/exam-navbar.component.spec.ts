import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamNavbarComponent } from './exam-navbar.component';

describe('ExamNavbarComponent', () => {
  let component: ExamNavbarComponent;
  let fixture: ComponentFixture<ExamNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
