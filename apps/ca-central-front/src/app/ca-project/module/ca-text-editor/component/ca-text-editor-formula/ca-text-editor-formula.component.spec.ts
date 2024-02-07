import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaTextEditorFormulaComponent} from './ca-text-editor-formula.component';

describe('FlTextEditorFormulaComponent', () => {
  let component: CaTextEditorFormulaComponent;
  let fixture: ComponentFixture<CaTextEditorFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaTextEditorFormulaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaTextEditorFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
