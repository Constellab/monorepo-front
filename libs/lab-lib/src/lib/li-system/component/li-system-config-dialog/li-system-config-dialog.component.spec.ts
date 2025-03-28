import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiSystemConfigDialogComponent } from './li-system-config-dialog.component';

describe('LabPipPackagesDialogComponent', () => {
  let component: LiSystemConfigDialogComponent;
  let fixture: ComponentFixture<LiSystemConfigDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSystemConfigDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSystemConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
