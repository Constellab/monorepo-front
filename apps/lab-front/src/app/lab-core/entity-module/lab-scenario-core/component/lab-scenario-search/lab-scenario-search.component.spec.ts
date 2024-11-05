import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioSearchComponent } from './lab-scenario-search.component';

describe('BioxScenarioSearchComponent', () => {
  let component: LabScenarioSearchComponent;
  let fixture: ComponentFixture<LabScenarioSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabScenarioSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabScenarioSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
