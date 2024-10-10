import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioTemplateSearchFormComponent } from './lab-scenario-template-search-form.component';

describe('LabScenarioTemplateSearchFormComponent', () => {
  let component: LabScenarioTemplateSearchFormComponent;
  let fixture: ComponentFixture<LabScenarioTemplateSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabScenarioTemplateSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabScenarioTemplateSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
