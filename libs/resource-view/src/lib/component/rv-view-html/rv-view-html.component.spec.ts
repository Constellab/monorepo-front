import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RvViewHtmlComponent } from './rv-view-html.component';

describe('RvViewHtmlComponent', () => {
  let component: RvViewHtmlComponent;
  let fixture: ComponentFixture<RvViewHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RvViewHtmlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RvViewHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
