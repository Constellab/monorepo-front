import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeTextEditorSaveComponent } from './te-text-editor-save.component';

describe('TeTextEditorSaveComponent', () => {
  let component: TeTextEditorSaveComponent;
  let fixture: ComponentFixture<TeTextEditorSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTextEditorSaveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeTextEditorSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
