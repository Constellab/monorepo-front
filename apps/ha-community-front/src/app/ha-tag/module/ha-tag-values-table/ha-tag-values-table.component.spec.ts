import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaTagValuesTableComponent } from './ha-tag-values-table.component';

describe('HaTagValuesTableComponent', () => {
  let component: HaTagValuesTableComponent;
  let fixture: ComponentFixture<HaTagValuesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaTagValuesTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaTagValuesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
