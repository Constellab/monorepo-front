import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaLabFreeTrialFormDialogComponent} from './ca-lab-free-trial-form-dialog.component';

describe('CaLabFreeTrialFormDialogComponent', () => {
  let component: CaLabFreeTrialFormDialogComponent;
  let fixture: ComponentFixture<CaLabFreeTrialFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabFreeTrialFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabFreeTrialFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
