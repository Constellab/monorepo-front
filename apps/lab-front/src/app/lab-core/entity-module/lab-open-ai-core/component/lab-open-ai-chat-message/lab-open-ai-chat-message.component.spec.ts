import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabOpenAiChatMessageComponent} from './lab-open-ai-chat-message.component';

describe('LabOpenAiChatMessageComponent', () => {
  let component: LabOpenAiChatMessageComponent;
  let fixture: ComponentFixture<LabOpenAiChatMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabOpenAiChatMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabOpenAiChatMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
