import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioInlineComponent } from './lab-scenario-inline.component';

describe('LabScenarioInlineComponent', () => {
  let component: LabScenarioInlineComponent;
  let fixture: ComponentFixture<LabScenarioInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabScenarioInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabScenarioInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
