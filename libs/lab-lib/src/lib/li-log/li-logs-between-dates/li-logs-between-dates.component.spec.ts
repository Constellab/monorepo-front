import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiLogsBetweenDatesComponent } from './li-logs-between-dates.component';

describe('LiLogsBetweenDatesComponent', () => {
  let component: LiLogsBetweenDatesComponent;
  let fixture: ComponentFixture<LiLogsBetweenDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiLogsBetweenDatesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiLogsBetweenDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
