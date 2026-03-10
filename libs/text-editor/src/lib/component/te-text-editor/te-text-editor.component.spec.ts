import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, PLATFORM_ID } from '@angular/core';

import { MockTranslatePipe } from '../te-test-helpers';
import { TeTextEditorComponent } from './te-text-editor.component';

describe('TeTextEditorComponent', () => {
  let component: TeTextEditorComponent;
  let fixture: ComponentFixture<TeTextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTextEditorComponent, MockTranslatePipe],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeTextEditorComponent);
    component = fixture.componentInstance;
    component.config = { uiConfig: { dense: false } } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
