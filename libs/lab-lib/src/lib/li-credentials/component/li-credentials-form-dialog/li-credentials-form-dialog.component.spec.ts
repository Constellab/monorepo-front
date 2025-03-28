import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiCredentialsFormDialogComponent } from './li-credentials-form-dialog.component';

describe('LiCredentialsFormDialogComponent', () => {
  let component: LiCredentialsFormDialogComponent;
  let fixture: ComponentFixture<LiCredentialsFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiCredentialsFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiCredentialsFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
