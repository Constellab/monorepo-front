import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaTextEditorFormulaDialogComponent} from './ca-text-editor-formula-dialog.component';

describe('FlTextEditorFormulaDialogComponent', () => {
  let component: CaTextEditorFormulaDialogComponent;
  let fixture: ComponentFixture<CaTextEditorFormulaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaTextEditorFormulaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaTextEditorFormulaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
