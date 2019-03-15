import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamResumeComponent } from './exam-resume.component';

describe('ExamResumeComponent', () => {
  let component: ExamResumeComponent;
  let fixture: ComponentFixture<ExamResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamResumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
