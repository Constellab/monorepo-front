import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiOpenAiChatDynamicFieldComponent } from './li-open-ai-chat-dynamic-field.component';

describe('LiOpenAiChatDynamicFieldComponent', () => {
  let component: LiOpenAiChatDynamicFieldComponent;
  let fixture: ComponentFixture<LiOpenAiChatDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiOpenAiChatDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiOpenAiChatDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
