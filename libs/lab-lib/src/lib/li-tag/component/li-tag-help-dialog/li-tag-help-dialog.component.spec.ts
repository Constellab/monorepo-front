import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiTagHelpDialogComponent } from './li-tag-help-dialog.component';

describe('LabTagHelpPortalComponent', () => {
  let component: LiTagHelpDialogComponent;
  let fixture: ComponentFixture<LiTagHelpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiTagHelpDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiTagHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
