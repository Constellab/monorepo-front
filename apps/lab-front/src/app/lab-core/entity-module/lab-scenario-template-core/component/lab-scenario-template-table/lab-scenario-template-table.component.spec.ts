import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioTemplateTableComponent } from './lab-scenario-template-table.component';

describe('LabScenarioTemplateTableComponent', () => {
  let component: LabScenarioTemplateTableComponent;
  let fixture: ComponentFixture<LabScenarioTemplateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabScenarioTemplateTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabScenarioTemplateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
