import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioTemplateDetailComponent } from './lab-scenario-template-detail.component';

describe('LabScenarioTemplateDetailComponent', () => {
  let component: LabScenarioTemplateDetailComponent;
  let fixture: ComponentFixture<LabScenarioTemplateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabScenarioTemplateDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabScenarioTemplateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
