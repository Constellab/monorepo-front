import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoTagValuesTableComponent } from './co-tag-values-table.component';

describe('CoTagValuesTableComponent', () => {
  let component: CoTagValuesTableComponent;
  let fixture: ComponentFixture<CoTagValuesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoTagValuesTableComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CoTagValuesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
