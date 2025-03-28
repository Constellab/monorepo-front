import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiLogLinesComponent } from './li-log-lines.component';

describe('LiLogLinesComponent', () => {
  let component: LiLogLinesComponent;
  let fixture: ComponentFixture<LiLogLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiLogLinesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiLogLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
