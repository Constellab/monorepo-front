import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaDashboardLastScenariosComponent } from './ca-dashboard-last-scenarios.component';

describe('CaDashboardLastScenariosComponent', () => {
  let component: CaDashboardLastScenariosComponent;
  let fixture: ComponentFixture<CaDashboardLastScenariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaDashboardLastScenariosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaDashboardLastScenariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
