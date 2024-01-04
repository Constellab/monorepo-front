import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TeTextEditorSsrComponent} from './te-text-editor-ssr.component';

describe('TeTextEditorSsrComponent', () => {
  let component: TeTextEditorSsrComponent;
  let fixture: ComponentFixture<TeTextEditorSsrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTextEditorSsrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeTextEditorSsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
