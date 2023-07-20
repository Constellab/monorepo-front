import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaLabFreeTrialComponent} from './ca-lab-free-trial.component';

describe('CaLabFreeTrialComponent', () => {
  let component: CaLabFreeTrialComponent;
  let fixture: ComponentFixture<CaLabFreeTrialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabFreeTrialComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabFreeTrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
