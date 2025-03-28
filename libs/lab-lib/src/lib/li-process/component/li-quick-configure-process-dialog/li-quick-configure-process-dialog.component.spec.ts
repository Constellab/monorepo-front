import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiQuickConfigureProcessDialogComponent } from './li-quick-configure-process-dialog.component';

describe('LiQuickConfigureProcessDialogComponent', () => {
  let component: LiQuickConfigureProcessDialogComponent;
  let fixture: ComponentFixture<LiQuickConfigureProcessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiQuickConfigureProcessDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiQuickConfigureProcessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
