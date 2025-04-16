import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiLogLineContentComponent } from './li-log-line-content.component';

describe('LiLogLineComponent', () => {
  let component: LiLogLineContentComponent;
  let fixture: ComponentFixture<LiLogLineContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiLogLineContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiLogLineContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
