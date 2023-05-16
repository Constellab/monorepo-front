import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabOpenAiChatComponent} from './lab-open-ai-chat.component';

describe('LabOpenAiChatComponent', () => {
  let component: LabOpenAiChatComponent;
  let fixture: ComponentFixture<LabOpenAiChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabOpenAiChatComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabOpenAiChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
