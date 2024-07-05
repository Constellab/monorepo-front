import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaProfileAttachedLinkComponent } from './ha-profile-attached-link.component';

describe('HaProfileAttachedLinkComponent', () => {
  let component: HaProfileAttachedLinkComponent;
  let fixture: ComponentFixture<HaProfileAttachedLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaProfileAttachedLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HaProfileAttachedLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
