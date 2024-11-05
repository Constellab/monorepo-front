import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaChatPageComponent } from './ca-chat-page.component';

describe('CaChatPageComponent', () => {
  let component: CaChatPageComponent;
  let fixture: ComponentFixture<CaChatPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaChatPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaChatPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
