import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib/fl-portal';
import { FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';
import { of } from 'rxjs';

import { MockFlDatasourceConnectPipe, MockTranslatePipe } from '../te-test-helpers';
import { TeMentionPortalComponent } from './te-mention-portal.component';

describe('TeMentionPortalComponent', () => {
  let component: TeMentionPortalComponent;
  let fixture: ComponentFixture<TeMentionPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeMentionPortalComponent, MockTranslatePipe, MockFlDatasourceConnectPipe],
      providers: [
        {
          provide: FL_PORTAL_DATA,
          useValue: {
            config: { searchUsers: () => of([]), getUsers: () => of({ results: [], total: 0 }) },
            filter$: of(''),
            element: document.createElement('div'),
            caretCoordinates: { top: 0, left: 0 },
          },
        },
        { provide: FlOverlayRef, useValue: { close: () => {}, dispose: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeMentionPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
