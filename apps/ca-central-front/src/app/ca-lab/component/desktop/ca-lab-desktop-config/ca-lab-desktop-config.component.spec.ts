import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabDesktopConfigComponent } from './ca-lab-desktop-config.component';

describe('CaLabDesktopConfigComponent', () => {
  let component: CaLabDesktopConfigComponent;
  let fixture: ComponentFixture<CaLabDesktopConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabDesktopConfigComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabDesktopConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
