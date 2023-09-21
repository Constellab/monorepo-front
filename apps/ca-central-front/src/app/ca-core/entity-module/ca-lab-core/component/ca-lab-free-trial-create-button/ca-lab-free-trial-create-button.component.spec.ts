import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaLabFreeTrialCreateButtonComponent} from './ca-lab-free-trial-create-button.component';

describe('CaLabFreeTrialCreateButtonComponent', () => {
  let component: CaLabFreeTrialCreateButtonComponent;
  let fixture: ComponentFixture<CaLabFreeTrialCreateButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabFreeTrialCreateButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabFreeTrialCreateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
