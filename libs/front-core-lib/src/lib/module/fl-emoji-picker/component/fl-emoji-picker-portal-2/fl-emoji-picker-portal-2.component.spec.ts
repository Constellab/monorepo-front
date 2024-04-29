import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FlEmojiPickerPortal2Component} from './fl-emoji-picker-portal-2.component';

describe('FlEmojiPickerPortal2Component', () => {
  let component: FlEmojiPickerPortal2Component;
  let fixture: ComponentFixture<FlEmojiPickerPortal2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlEmojiPickerPortal2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlEmojiPickerPortal2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
