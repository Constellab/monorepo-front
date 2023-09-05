import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaLabInstanceUsageComponent} from './ca-lab-instance-usage.component';

describe('CaLabInstanceUsageComponent', () => {
  let component: CaLabInstanceUsageComponent;
  let fixture: ComponentFixture<CaLabInstanceUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabInstanceUsageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabInstanceUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
