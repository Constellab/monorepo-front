import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MockTranslatePipe } from '../te-test-helpers';
import { TeMentionInlineComponent } from './te-mention-inline.component';

describe('TeMentionInlineComponent', () => {
  let component: TeMentionInlineComponent;
  let fixture: ComponentFixture<TeMentionInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeMentionInlineComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeMentionInlineComponent);
    component = fixture.componentInstance;
    component.data = { firstname: '', lastname: '', id: '' } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
