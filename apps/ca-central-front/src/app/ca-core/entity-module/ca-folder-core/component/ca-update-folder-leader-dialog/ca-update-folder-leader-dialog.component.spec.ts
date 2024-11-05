import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaUpdateFolderLeaderDialogComponent } from './ca-update-folder-leader-dialog.component';

describe('CaUpdateFolderLeaderDialogComponent', () => {
  let component: CaUpdateFolderLeaderDialogComponent;
  let fixture: ComponentFixture<CaUpdateFolderLeaderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaUpdateFolderLeaderDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaUpdateFolderLeaderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
