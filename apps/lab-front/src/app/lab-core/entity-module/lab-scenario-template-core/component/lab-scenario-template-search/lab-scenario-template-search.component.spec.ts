import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioTemplateSearchComponent } from './lab-scenario-template-search.component';

describe('LabScenarioTemplateSearchComponent', () => {
  let component: LabScenarioTemplateSearchComponent;
  let fixture: ComponentFixture<LabScenarioTemplateSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabScenarioTemplateSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabScenarioTemplateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
