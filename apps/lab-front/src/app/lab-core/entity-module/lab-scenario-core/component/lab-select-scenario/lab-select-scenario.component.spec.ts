import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSelectScenarioComponent } from './lab-select-scenario.component';

describe('LabSelectScenarioComponent', () => {
  let component: LabSelectScenarioComponent;
  let fixture: ComponentFixture<LabSelectScenarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectScenarioComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSelectScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
