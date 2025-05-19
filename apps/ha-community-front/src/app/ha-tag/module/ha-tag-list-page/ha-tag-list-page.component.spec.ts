import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaTagListPageComponent } from './ha-tag-list-page.component';

describe('HaTagListPageComponent', () => {
  let component: HaTagListPageComponent;
  let fixture: ComponentFixture<HaTagListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaTagListPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaTagListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
