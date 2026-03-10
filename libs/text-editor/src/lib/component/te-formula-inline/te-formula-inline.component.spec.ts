import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import { MockTranslatePipe } from '../te-test-helpers';
import { TeFormulaInlineComponent } from './te-formula-inline.component';

describe('TeFormulaInlineComponent', () => {
  let component: TeFormulaInlineComponent;
  let fixture: ComponentFixture<TeFormulaInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeFormulaInlineComponent, MockTranslatePipe],
      providers: [
        { provide: FlDialogService, useValue: { open: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeFormulaInlineComponent);
    component = fixture.componentInstance;
    component.data = { formula: '', title: '' } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
