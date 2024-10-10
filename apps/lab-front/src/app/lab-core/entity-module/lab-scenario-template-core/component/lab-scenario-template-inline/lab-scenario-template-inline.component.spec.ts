import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioTemplateInlineComponent } from './lab-scenario-template-inline.component';

describe('LabScenarioTemplateInlineComponent', () => {
  let component: LabScenarioTemplateInlineComponent;
  let fixture: ComponentFixture<LabScenarioTemplateInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabScenarioTemplateInlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabScenarioTemplateInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
