import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiLogCompleteInfoDialogComponent } from './li-log-complete-info-dialog.component';

describe('LiLogCompleteInfoDialogComponent', () => {
  let component: LiLogCompleteInfoDialogComponent;
  let fixture: ComponentFixture<LiLogCompleteInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiLogCompleteInfoDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiLogCompleteInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
