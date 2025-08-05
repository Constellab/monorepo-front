import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiScenarioTemplateTableComponent } from './li-scenario-template-table.component';

describe('LiScenarioTemplateTableComponent', () => {
  let component: LiScenarioTemplateTableComponent;
  let fixture: ComponentFixture<LiScenarioTemplateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiScenarioTemplateTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiScenarioTemplateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
