import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintfrontComponent } from './complaintfront.component';

describe('ComplaintfrontComponent', () => {
  let component: ComplaintfrontComponent;
  let fixture: ComponentFixture<ComplaintfrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintfrontComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintfrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
