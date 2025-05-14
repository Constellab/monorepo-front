import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderUsersDialogComponent } from './ca-folder-users-dialog.component';

describe('CaFolderSharedGroupsListComponent', () => {
  let component: CaFolderUsersDialogComponent;
  let fixture: ComponentFixture<CaFolderUsersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderUsersDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaFolderUsersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
