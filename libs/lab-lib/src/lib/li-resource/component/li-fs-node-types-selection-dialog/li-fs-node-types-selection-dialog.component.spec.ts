import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiFsNodeTypesSelectionDialogComponent } from './li-fs-node-types-selection-dialog.component';

describe('UploadFolderDialogComponent', () => {
  let component: LiFsNodeTypesSelectionDialogComponent;
  let fixture: ComponentFixture<LiFsNodeTypesSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiFsNodeTypesSelectionDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiFsNodeTypesSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
