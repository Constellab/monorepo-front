import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioSearchFormComponent } from './lab-scenario-search-form.component';

describe('BioxScenarioAdvancedSearchFormComponent', () => {
  let component: LabScenarioSearchFormComponent;
  let fixture: ComponentFixture<LabScenarioSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabScenarioSearchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabScenarioSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
