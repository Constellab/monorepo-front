import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiImportResourceDialogComponent } from './li-import-resource-dialog.component';

describe('LiImportResourceDialogComponent', () => {
  let component: LiImportResourceDialogComponent;
  let fixture: ComponentFixture<LiImportResourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiImportResourceDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiImportResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
