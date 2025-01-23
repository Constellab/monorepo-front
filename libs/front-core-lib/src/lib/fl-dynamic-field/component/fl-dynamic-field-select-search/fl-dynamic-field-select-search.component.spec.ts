import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlDynamicFieldSelectSearchComponent } from './fl-dynamic-field-select-search.component';

describe('FlDynamicFieldSelectSearchComponent', () => {
  let component: FlDynamicFieldSelectSearchComponent;
  let fixture: ComponentFixture<FlDynamicFieldSelectSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlDynamicFieldSelectSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlDynamicFieldSelectSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
