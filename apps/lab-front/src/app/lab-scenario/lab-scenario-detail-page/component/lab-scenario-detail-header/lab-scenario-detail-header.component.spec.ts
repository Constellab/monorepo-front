import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioDetailHeaderComponent } from './lab-scenario-detail-header.component';

describe('BioxScenarioDetailCardComponent', () => {
  let component: LabScenarioDetailHeaderComponent;
  let fixture: ComponentFixture<LabScenarioDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabScenarioDetailHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabScenarioDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
