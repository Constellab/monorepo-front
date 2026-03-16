import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import { MockTranslatePipe } from '../te-test-helpers';
import { TeFormulaComponent } from './te-formula.component';

describe('TeFormulaComponent', () => {
  let component: TeFormulaComponent;
  let fixture: ComponentFixture<TeFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeFormulaComponent, MockTranslatePipe],
      providers: [
        { provide: FlDialogService, useValue: { open: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
