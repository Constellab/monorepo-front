import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaTextEditorComponent } from './ca-text-editor.component';

describe('FlTextEditorComponent', () => {
  let component: CaTextEditorComponent;
  let fixture: ComponentFixture<CaTextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaTextEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
