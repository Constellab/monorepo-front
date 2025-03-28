import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiUpdateViewConfigDialogComponent } from './li-update-view-config-dialog.component';

describe('LabUpdateViewConfigNameDialogComponent', () => {
  let component: LiUpdateViewConfigDialogComponent;
  let fixture: ComponentFixture<LiUpdateViewConfigDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiUpdateViewConfigDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiUpdateViewConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
