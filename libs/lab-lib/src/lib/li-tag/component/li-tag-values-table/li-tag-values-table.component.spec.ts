import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiTagValuesTableComponent } from './li-tag-values-table.component';

describe('LiTagValuesTableComponent', () => {
  let component: LiTagValuesTableComponent;
  let fixture: ComponentFixture<LiTagValuesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiTagValuesTableComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LiTagValuesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
