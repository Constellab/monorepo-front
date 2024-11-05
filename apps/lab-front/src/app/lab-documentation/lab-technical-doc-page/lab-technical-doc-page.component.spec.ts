import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTechnicalDocPageComponent } from './lab-technical-doc-page.component';

describe('LabTechnicalDocComponent', () => {
  let component: LabTechnicalDocPageComponent;
  let fixture: ComponentFixture<LabTechnicalDocPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabTechnicalDocPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabTechnicalDocPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
