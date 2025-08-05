import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabUsageComponent } from './ca-lab-usage.component';

describe('CaLabUsageComponent', () => {
  let component: CaLabUsageComponent;
  let fixture: ComponentFixture<CaLabUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabUsageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
