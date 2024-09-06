import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaChatMessageComponent } from './ca-chat-message.component';

describe('CaChatMessageComponent', () => {
  let component: CaChatMessageComponent;
  let fixture: ComponentFixture<CaChatMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaChatMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaChatMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
