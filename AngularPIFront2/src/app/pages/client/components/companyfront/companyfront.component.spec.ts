import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyfrontComponent } from './companyfront.component';

describe('CompanyfrontComponent', () => {
  let component: CompanyfrontComponent;
  let fixture: ComponentFixture<CompanyfrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyfrontComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyfrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
