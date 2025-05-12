import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumetsComponent } from './documets.component';

describe('DocumetsComponent', () => {
  let component: DocumetsComponent;
  let fixture: ComponentFixture<DocumetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
