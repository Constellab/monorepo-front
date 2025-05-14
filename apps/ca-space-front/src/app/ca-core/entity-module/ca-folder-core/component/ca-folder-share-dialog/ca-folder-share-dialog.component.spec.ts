import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderShareDialogComponent } from './ca-folder-share-dialog.component';

describe('CaGroupShareDialogComponent', () => {
  let component: CaFolderShareDialogComponent;
  let fixture: ComponentFixture<CaFolderShareDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderShareDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaFolderShareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
