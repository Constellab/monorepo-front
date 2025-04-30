import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaLabRunningStatusTableComponent } from './ca-lab-running-status-table.component';

describe('CaLabRunningStatusTableComponent', () => {
  let component: CaLabRunningStatusTableComponent;
  let fixture: ComponentFixture<CaLabRunningStatusTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabRunningStatusTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabRunningStatusTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
