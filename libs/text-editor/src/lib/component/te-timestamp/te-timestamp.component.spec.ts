import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { DateTime } from 'luxon';

import { MockFlDatePipe, MockTranslatePipe } from '../te-test-helpers';
import { TeTimestampComponent } from './te-timestamp.component';

describe('TeTimestampComponent', () => {
  let component: TeTimestampComponent;
  let fixture: ComponentFixture<TeTimestampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTimestampComponent, MockTranslatePipe, MockFlDatePipe],
      providers: [
        { provide: FlDialogService, useValue: { open: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeTimestampComponent);
    component = fixture.componentInstance;
    component.timestamp = DateTime.now();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
