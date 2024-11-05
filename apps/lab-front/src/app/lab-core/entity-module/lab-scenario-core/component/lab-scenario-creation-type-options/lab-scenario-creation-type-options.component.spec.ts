import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioCreationTypeOptionsComponent } from './lab-scenario-creation-type-options.component';

describe('BioxScenarioTypeOptionsComponent', () => {
  let component: LabScenarioCreationTypeOptionsComponent;
  let fixture: ComponentFixture<LabScenarioCreationTypeOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabScenarioCreationTypeOptionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabScenarioCreationTypeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
