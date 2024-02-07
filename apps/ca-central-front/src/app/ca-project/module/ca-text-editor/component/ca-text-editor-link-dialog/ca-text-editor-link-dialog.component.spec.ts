import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaTextEditorLinkDialogComponent} from './ca-text-editor-link-dialog.component';

describe('FlTextEditorLinkDialogComponent', () => {
  let component: CaTextEditorLinkDialogComponent;
  let fixture: ComponentFixture<CaTextEditorLinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaTextEditorLinkDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaTextEditorLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
