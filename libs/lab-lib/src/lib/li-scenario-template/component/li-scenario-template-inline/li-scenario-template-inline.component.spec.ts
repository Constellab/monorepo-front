import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiScenarioTemplateInlineComponent } from './li-scenario-template-inline.component';

describe('LiScenarioTemplateInlineComponent', () => {
  let component: LiScenarioTemplateInlineComponent;
  let fixture: ComponentFixture<LiScenarioTemplateInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiScenarioTemplateInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiScenarioTemplateInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
