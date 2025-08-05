import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiBrickDataTableComponent } from './li-brick-data-table.component';

describe('LiBrickDataTableComponent', () => {
  let component: LiBrickDataTableComponent;
  let fixture: ComponentFixture<LiBrickDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiBrickDataTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiBrickDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
