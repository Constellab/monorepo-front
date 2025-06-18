import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RvViewAppComponent } from './rv-view-app.component';

describe('RvViewAppComponent', () => {
  let component: RvViewAppComponent;
  let fixture: ComponentFixture<RvViewAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RvViewAppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RvViewAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
