import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabOpenAiChatDynamicFieldComponent} from './lab-open-ai-chat-dynamic-field.component';

describe('LabOpenAiChatDynamicFieldComponent', () => {
  let component: LabOpenAiChatDynamicFieldComponent;
  let fixture: ComponentFixture<LabOpenAiChatDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabOpenAiChatDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabOpenAiChatDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
