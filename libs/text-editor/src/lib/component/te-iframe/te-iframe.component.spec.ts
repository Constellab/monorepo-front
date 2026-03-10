import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import { MockTranslatePipe } from '../te-test-helpers';
import { TeIframeComponent } from './te-iframe.component';

describe('TeIframeComponent', () => {
  let component: TeIframeComponent;
  let fixture: ComponentFixture<TeIframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeIframeComponent, MockTranslatePipe],
      providers: [
        { provide: FlDialogService, useValue: { open: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeIframeComponent);
    component = fixture.componentInstance;
    component.data = { url: '', iframeHeight: 300 } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
