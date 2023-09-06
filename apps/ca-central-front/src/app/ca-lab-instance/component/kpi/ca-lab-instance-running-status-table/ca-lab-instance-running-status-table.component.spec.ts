import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaLabInstanceRunningStatusTableComponent } from './ca-lab-instance-running-status-table.component';

describe('CaLabInstanceRunningStatusTableComponent', () => {
  let component: CaLabInstanceRunningStatusTableComponent;
  let fixture: ComponentFixture<CaLabInstanceRunningStatusTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabInstanceRunningStatusTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabInstanceRunningStatusTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
