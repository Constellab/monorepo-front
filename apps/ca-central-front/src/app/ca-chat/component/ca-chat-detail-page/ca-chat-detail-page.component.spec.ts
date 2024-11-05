import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaChatDetailPageComponent } from './ca-chat-detail-page.component';

describe('CaChatDetailPageComponent', () => {
  let component: CaChatDetailPageComponent;
  let fixture: ComponentFixture<CaChatDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaChatDetailPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaChatDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
