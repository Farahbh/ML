import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventfrontComponent } from './eventfront.component';

describe('EventfrontComponent', () => {
  let component: EventfrontComponent;
  let fixture: ComponentFixture<EventfrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventfrontComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventfrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
