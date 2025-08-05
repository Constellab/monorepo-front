import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSelectScenarioTemplateDialogComponent } from './li-select-scenario-template-dialog.component';

describe('LiSelectScenarioTemplateDialogComponent', () => {
  let component: LiSelectScenarioTemplateDialogComponent;
  let fixture: ComponentFixture<LiSelectScenarioTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectScenarioTemplateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSelectScenarioTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
