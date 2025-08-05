import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSelectScenarioDialogComponent } from './li-select-scenario-dialog.component';

describe('LiSelectScenarioDialogComponent', () => {
  let component: LiSelectScenarioDialogComponent;
  let fixture: ComponentFixture<LiSelectScenarioDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectScenarioDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiSelectScenarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
