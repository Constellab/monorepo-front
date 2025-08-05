import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiOpenAiChatMessageComponent } from './li-open-ai-chat-message.component';

describe('LiOpenAiChatMessageComponent', () => {
  let component: LiOpenAiChatMessageComponent;
  let fixture: ComponentFixture<LiOpenAiChatMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiOpenAiChatMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiOpenAiChatMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
