import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RvViewIframeComponent } from './rv-view-iframe.component';

describe('RvViewIframeComponent', () => {
  let component: RvViewIframeComponent;
  let fixture: ComponentFixture<RvViewIframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RvViewIframeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RvViewIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
