import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogVerificationComponent } from './log-verification.component';

describe('LogVerificationComponent', () => {
  let component: LogVerificationComponent;
  let fixture: ComponentFixture<LogVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogVerificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
