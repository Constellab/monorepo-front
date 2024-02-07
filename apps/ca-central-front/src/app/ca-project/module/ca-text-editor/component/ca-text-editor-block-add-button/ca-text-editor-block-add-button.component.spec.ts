import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaTextEditorBlockAddButtonComponent} from './ca-text-editor-block-add-button.component';

describe('FlTextEditorBlockAddButtonComponent', () => {
  let component: CaTextEditorBlockAddButtonComponent;
  let fixture: ComponentFixture<CaTextEditorBlockAddButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaTextEditorBlockAddButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaTextEditorBlockAddButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
