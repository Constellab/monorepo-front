import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import { MockTranslatePipe } from '../te-test-helpers';
import { TeTitleCaptionComponent } from './te-title-caption.component';

describe('CaTextEditorTitleCaptionComponent', () => {
  let component: TeTitleCaptionComponent;
  let fixture: ComponentFixture<TeTitleCaptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTitleCaptionComponent, MockTranslatePipe],
      providers: [
        { provide: FlDialogService, useValue: { open: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeTitleCaptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
