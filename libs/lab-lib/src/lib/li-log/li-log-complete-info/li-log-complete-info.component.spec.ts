import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiLogCompleteInfoComponent } from './li-log-complete-info.component';

describe('LiLogCompleteInfoComponent', () => {
  let component: LiLogCompleteInfoComponent;
  let fixture: ComponentFixture<LiLogCompleteInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiLogCompleteInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiLogCompleteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
