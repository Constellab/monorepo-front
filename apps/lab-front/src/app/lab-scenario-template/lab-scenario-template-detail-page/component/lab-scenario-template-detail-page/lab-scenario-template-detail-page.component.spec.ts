import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioTemplateDetailPageComponent } from './lab-scenario-template-detail-page.component';

describe('LabScenarioTemplateDetailPageComponent', () => {
  let component: LabScenarioTemplateDetailPageComponent;
  let fixture: ComponentFixture<LabScenarioTemplateDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabScenarioTemplateDetailPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabScenarioTemplateDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
