import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobRecomandationComponent } from './job-recomandation.component';

describe('JobRecomandationComponent', () => {
  let component: JobRecomandationComponent;
  let fixture: ComponentFixture<JobRecomandationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobRecomandationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobRecomandationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
