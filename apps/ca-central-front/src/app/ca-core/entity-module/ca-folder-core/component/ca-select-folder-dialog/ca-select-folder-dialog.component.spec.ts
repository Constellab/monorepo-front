import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaSelectFolderDialogComponent } from './ca-select-folder-dialog.component';

describe('CaSelectFolderDialogComponent', () => {
  let component: CaSelectFolderDialogComponent;
  let fixture: ComponentFixture<CaSelectFolderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaSelectFolderDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaSelectFolderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
