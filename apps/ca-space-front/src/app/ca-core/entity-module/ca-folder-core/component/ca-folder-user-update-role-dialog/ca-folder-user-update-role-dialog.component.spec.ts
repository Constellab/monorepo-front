import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderUserUpdateRoleDialogComponent } from './ca-folder-user-update-role-dialog.component';

describe('CaFolderUserUpdateRoleDialogComponent', () => {
  let component: CaFolderUserUpdateRoleDialogComponent;
  let fixture: ComponentFixture<CaFolderUserUpdateRoleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaFolderUserUpdateRoleDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaFolderUserUpdateRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
