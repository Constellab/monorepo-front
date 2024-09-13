import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabResourceUpdateFolderDialogComponent} from './lab-resource-update-folder-dialog.component';

describe('LabResourceUpdateFolderDialogComponent', () => {
  let component: LabResourceUpdateFolderDialogComponent;
  let fixture: ComponentFixture<LabResourceUpdateFolderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabResourceUpdateFolderDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabResourceUpdateFolderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
