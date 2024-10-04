import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaDashboardFoldersComponent} from './ca-dashboard-folders.component';

describe('DashboardFoldersComponent', () => {
  let component: CaDashboardFoldersComponent;
  let fixture: ComponentFixture<CaDashboardFoldersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaDashboardFoldersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaDashboardFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
