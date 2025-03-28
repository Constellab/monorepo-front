import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiLogsBetweenDatesDialogComponent } from './li-logs-between-dates-dialog.component';

describe('LabLogsBetweenDatesDialogsComponent', () => {
  let component: LiLogsBetweenDatesDialogComponent;
  let fixture: ComponentFixture<LiLogsBetweenDatesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiLogsBetweenDatesDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiLogsBetweenDatesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
