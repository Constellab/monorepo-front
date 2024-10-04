import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioDetailPageComponent } from './lab-scenario-detail-page.component';

describe('BioxScenarioDetailPageComponent', () => {
  let component: LabScenarioDetailPageComponent;
  let fixture: ComponentFixture<LabScenarioDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabScenarioDetailPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabScenarioDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
