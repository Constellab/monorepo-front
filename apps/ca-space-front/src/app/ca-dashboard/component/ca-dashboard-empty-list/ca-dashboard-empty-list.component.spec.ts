import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaDashboardEmptyListComponent } from './ca-dashboard-empty-list.component';

describe('CaDashboardEmptyListComponent', () => {
  let component: CaDashboardEmptyListComponent;
  let fixture: ComponentFixture<CaDashboardEmptyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaDashboardEmptyListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaDashboardEmptyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
