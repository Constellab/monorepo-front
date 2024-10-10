import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioTemplatesSearchPageComponent } from './lab-scenario-templates-search-page.component';

describe('LabScenarioTemplatesPageComponent', () => {
  let component: LabScenarioTemplatesSearchPageComponent;
  let fixture: ComponentFixture<LabScenarioTemplatesSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabScenarioTemplatesSearchPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabScenarioTemplatesSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
