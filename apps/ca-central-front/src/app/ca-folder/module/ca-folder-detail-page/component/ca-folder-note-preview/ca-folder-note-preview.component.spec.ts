import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderNotePreviewComponent } from './ca-folder-note-preview.component';

describe('CaFolderNotePreviewComponent', () => {
  let component: CaFolderNotePreviewComponent;
  let fixture: ComponentFixture<CaFolderNotePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaFolderNotePreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaFolderNotePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
