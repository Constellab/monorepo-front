import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import { MockTranslatePipe } from '../te-test-helpers';
import { TeVariableInlineComponent } from './te-variable-inline.component';

describe('TeVariableInlineComponent', () => {
  let component: TeVariableInlineComponent;
  let fixture: ComponentFixture<TeVariableInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeVariableInlineComponent, MockTranslatePipe],
      providers: [
        { provide: FlDialogService, useValue: { open: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeVariableInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
