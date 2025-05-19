import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaTagPageComponent } from './ha-tag-page.component';

describe('HaTagPageComponent', () => {
  let component: HaTagPageComponent;
  let fixture: ComponentFixture<HaTagPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaTagPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaTagPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
