import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderUploadFileOverrideDialogComponent } from './ca-folder-upload-file-override-dialog.component';

describe('CaFolderUploadFileOverrideDialogComponent', () => {
  let component: CaFolderUploadFileOverrideDialogComponent;
  let fixture: ComponentFixture<CaFolderUploadFileOverrideDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaFolderUploadFileOverrideDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaFolderUploadFileOverrideDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
