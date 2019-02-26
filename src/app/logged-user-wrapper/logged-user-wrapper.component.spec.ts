import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedUserWrapperComponent } from './logged-user-wrapper.component';

describe('LoggedUserWrapperComponent', () => {
  let component: LoggedUserWrapperComponent;
  let fixture: ComponentFixture<LoggedUserWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggedUserWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedUserWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
