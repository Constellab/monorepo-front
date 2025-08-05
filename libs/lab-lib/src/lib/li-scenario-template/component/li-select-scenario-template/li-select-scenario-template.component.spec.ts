import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSelectScenarioTemplateComponent } from './li-select-scenario-template.component';

describe('LiSelectScenarioTemplateComponent', () => {
  let component: LiSelectScenarioTemplateComponent;
  let fixture: ComponentFixture<LiSelectScenarioTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectScenarioTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSelectScenarioTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
