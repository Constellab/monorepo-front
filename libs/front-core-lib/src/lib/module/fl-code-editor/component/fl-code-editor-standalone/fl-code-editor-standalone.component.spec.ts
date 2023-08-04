import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FlCodeEditorStandaloneComponent} from './fl-code-editor-standalone.component';

describe('LabPythonEditorComponent', () => {
  let component: FlCodeEditorStandaloneComponent;
  let fixture: ComponentFixture<FlCodeEditorStandaloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FlCodeEditorStandaloneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlCodeEditorStandaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
