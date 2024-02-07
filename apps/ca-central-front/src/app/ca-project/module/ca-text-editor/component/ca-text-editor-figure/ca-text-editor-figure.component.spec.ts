import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaTextEditorFigureComponent} from './ca-text-editor-figure.component';

describe('FlTextEditorFigureComponent', () => {
  let component: CaTextEditorFigureComponent;
  let fixture: ComponentFixture<CaTextEditorFigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaTextEditorFigureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaTextEditorFigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
