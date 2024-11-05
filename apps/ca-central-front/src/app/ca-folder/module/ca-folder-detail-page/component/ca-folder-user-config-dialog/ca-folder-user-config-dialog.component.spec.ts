import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderUserConfigDialogComponent } from './ca-folder-user-config-dialog.component';

describe('CaFolderUserConfigDialogComponent', () => {
  let component: CaFolderUserConfigDialogComponent;
  let fixture: ComponentFixture<CaFolderUserConfigDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaFolderUserConfigDialogComponent],
    });
    fixture = TestBed.createComponent(CaFolderUserConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
