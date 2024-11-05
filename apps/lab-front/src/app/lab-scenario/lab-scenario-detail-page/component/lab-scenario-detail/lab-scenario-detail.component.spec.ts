import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioDetailComponent } from './lab-scenario-detail.component';

describe('LabScenarioDetailComponent', () => {
  let component: LabScenarioDetailComponent;
  let fixture: ComponentFixture<LabScenarioDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabScenarioDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabScenarioDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
