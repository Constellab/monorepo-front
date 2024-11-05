import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaDashboardLabsComponent } from './ca-dashboard-labs.component';

describe('DashboardLabsComponent', () => {
  let component: CaDashboardLabsComponent;
  let fixture: ComponentFixture<CaDashboardLabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaDashboardLabsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaDashboardLabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
