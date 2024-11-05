import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioTemplateDetailHeaderComponent } from './lab-scenario-template-detail-header.component';

describe('LabScenarioTemplateDetailHeaderComponent', () => {
  let component: LabScenarioTemplateDetailHeaderComponent;
  let fixture: ComponentFixture<LabScenarioTemplateDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabScenarioTemplateDetailHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabScenarioTemplateDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
