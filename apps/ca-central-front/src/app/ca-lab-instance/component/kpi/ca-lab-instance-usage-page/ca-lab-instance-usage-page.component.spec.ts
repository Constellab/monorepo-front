import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaLabInstanceUsagePageComponent} from './ca-lab-instance-usage-page.component';

describe('CaLabInstanceUsagePageComponent', () => {
  let component: CaLabInstanceUsagePageComponent;
  let fixture: ComponentFixture<CaLabInstanceUsagePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabInstanceUsagePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabInstanceUsagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
