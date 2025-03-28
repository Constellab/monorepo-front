import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiResourceUpdateFolderDialogComponent } from './li-resource-update-folder-dialog.component';

describe('LiResourceUpdateFolderDialogComponent', () => {
  let component: LiResourceUpdateFolderDialogComponent;
  let fixture: ComponentFixture<LiResourceUpdateFolderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceUpdateFolderDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiResourceUpdateFolderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
