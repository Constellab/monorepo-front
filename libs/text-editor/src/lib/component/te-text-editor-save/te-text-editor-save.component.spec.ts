import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { TeTextEditorSaveComponent } from './te-text-editor-save.component';

describe('TeTextEditorSaveComponent', () => {
  let component: TeTextEditorSaveComponent;
  let fixture: ComponentFixture<TeTextEditorSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTextEditorSaveComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeTextEditorSaveComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('textEditor', { textChange: of() });
    component.saveFunc = () => of(null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
