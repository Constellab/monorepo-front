import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaLabFreeTrialInfoComponent} from './ca-lab-free-trial-info.component';

describe('LabFreeTrialInfoComponent', () => {
  let component: CaLabFreeTrialInfoComponent;
  let fixture: ComponentFixture<CaLabFreeTrialInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabFreeTrialInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabFreeTrialInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
