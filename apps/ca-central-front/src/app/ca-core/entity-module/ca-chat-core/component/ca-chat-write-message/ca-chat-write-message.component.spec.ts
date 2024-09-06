import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaChatWriteMessageComponent } from './ca-chat-write-message.component';

describe('CaChatWriteMessageComponent', () => {
  let component: CaChatWriteMessageComponent;
  let fixture: ComponentFixture<CaChatWriteMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaChatWriteMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaChatWriteMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
