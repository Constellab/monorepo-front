import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiOpenAiChatComponent } from './li-open-ai-chat.component';

describe('LiOpenAiChatComponent', () => {
  let component: LiOpenAiChatComponent;
  let fixture: ComponentFixture<LiOpenAiChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiOpenAiChatComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiOpenAiChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
