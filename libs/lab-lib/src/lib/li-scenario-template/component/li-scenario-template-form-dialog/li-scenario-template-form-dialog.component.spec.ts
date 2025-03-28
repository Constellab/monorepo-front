import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiScenarioTemplateFormDialogComponent } from './li-scenario-template-form-dialog.component';

describe('LiScenarioTemplateFormDialogComponent', () => {
  let component: LiScenarioTemplateFormDialogComponent;
  let fixture: ComponentFixture<LiScenarioTemplateFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiScenarioTemplateFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiScenarioTemplateFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
