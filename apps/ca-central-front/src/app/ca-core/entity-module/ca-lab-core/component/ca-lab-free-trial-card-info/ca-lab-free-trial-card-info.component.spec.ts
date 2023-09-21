import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaLabFreeTrialCardInfoComponent} from './ca-lab-free-trial-card-info.component';

describe('CaUserFreeTrialInfoComponent', () => {
  let component: CaLabFreeTrialCardInfoComponent;
  let fixture: ComponentFixture<CaLabFreeTrialCardInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabFreeTrialCardInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabFreeTrialCardInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
