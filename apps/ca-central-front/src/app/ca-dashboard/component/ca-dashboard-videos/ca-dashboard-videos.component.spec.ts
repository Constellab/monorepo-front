import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaDashboardVideosComponent } from './ca-dashboard-videos.component';

describe('CaDashboardVideosComponent', () => {
  let component: CaDashboardVideosComponent;
  let fixture: ComponentFixture<CaDashboardVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaDashboardVideosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaDashboardVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
