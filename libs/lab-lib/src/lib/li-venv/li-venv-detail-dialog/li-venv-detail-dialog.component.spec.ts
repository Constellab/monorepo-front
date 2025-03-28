import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiVenvDetailDialogComponent } from './li-venv-detail-dialog.component';

describe('LiVenvDetailDialogComponent', () => {
  let component: LiVenvDetailDialogComponent;
  let fixture: ComponentFixture<LiVenvDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiVenvDetailDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiVenvDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
