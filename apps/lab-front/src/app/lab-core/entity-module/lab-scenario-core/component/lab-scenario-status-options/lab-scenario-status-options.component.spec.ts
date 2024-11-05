import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioStatusOptionsComponent } from './lab-scenario-status-options.component';

describe('BioxScenarioStatusOptionsComponent', () => {
  let component: LabScenarioStatusOptionsComponent;
  let fixture: ComponentFixture<LabScenarioStatusOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabScenarioStatusOptionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabScenarioStatusOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
