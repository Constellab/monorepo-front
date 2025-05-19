import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaTagAdditionalInfoSpecsTableComponent } from './ha-tag-additional-info-specs-table.component';

describe('HaTagAdditionalInfoSpecsTableComponent', () => {
  let component: HaTagAdditionalInfoSpecsTableComponent;
  let fixture: ComponentFixture<HaTagAdditionalInfoSpecsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaTagAdditionalInfoSpecsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaTagAdditionalInfoSpecsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
