import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiLogTableComponent } from './li-log-table.component';

describe('LiLogTableComponent', () => {
  let component: LiLogTableComponent;
  let fixture: ComponentFixture<LiLogTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiLogTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiLogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
