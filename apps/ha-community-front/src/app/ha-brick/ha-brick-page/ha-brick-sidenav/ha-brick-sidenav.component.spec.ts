import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaBrickSidenavComponent } from './ha-brick-sidenav.component';

describe('DaPublicSidenavComponent', () => {
  let component: HaBrickSidenavComponent;
  let fixture: ComponentFixture<HaBrickSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaBrickSidenavComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaBrickSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
