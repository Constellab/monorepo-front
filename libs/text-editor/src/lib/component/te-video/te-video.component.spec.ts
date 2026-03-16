import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import { MockTranslatePipe } from '../te-test-helpers';
import { TeVideoComponent } from './te-video.component';

describe('CaTextEditorVideoComponent', () => {
  let component: TeVideoComponent;
  let fixture: ComponentFixture<TeVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeVideoComponent, MockTranslatePipe],
      providers: [
        { provide: FlDialogService, useValue: { open: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
