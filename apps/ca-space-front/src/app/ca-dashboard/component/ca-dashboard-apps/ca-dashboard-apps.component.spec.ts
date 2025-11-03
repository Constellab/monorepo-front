import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaDashboardAppsComponent } from './ca-dashboard-apps.component';

describe('DashboardAppsComponent', () => {
  let component: CaDashboardAppsComponent;
  let fixture: ComponentFixture<CaDashboardAppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaDashboardAppsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaDashboardAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
