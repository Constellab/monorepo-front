import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiScenarioFormDialogComponent } from './li-scenario-form-dialog.component';

describe('LiScenarioFormDialogComponent', () => {
  let component: LiScenarioFormDialogComponent;
  let fixture: ComponentFixture<LiScenarioFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiScenarioFormDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiScenarioFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
