import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExamViewComponent } from './edit-exam-view.component';

describe('EditExamViewComponent', () => {
  let component: EditExamViewComponent;
  let fixture: ComponentFixture<EditExamViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditExamViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExamViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
