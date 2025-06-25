import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaNotificationInfoComponent } from './ca-notification-info.component';

describe('CaNotificationInfoComponent', () => {
  let component: CaNotificationInfoComponent;
  let fixture: ComponentFixture<CaNotificationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaNotificationInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaNotificationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
