import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaLabUsagePageComponent } from './ca-lab-usage-page.component';

describe('CaLabUsagePageComponent', () => {
  let component: CaLabUsagePageComponent;
  let fixture: ComponentFixture<CaLabUsagePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabUsagePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabUsagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
