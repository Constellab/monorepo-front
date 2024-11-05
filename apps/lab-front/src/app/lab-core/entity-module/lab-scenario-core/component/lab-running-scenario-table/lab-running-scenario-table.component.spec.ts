import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabRunningScenarioTableComponent } from './lab-running-scenario-table.component';

describe('LabRunningScenarioTableComponent', () => {
  let component: LabRunningScenarioTableComponent;
  let fixture: ComponentFixture<LabRunningScenarioTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabRunningScenarioTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabRunningScenarioTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
