import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HaRunStatAggregatePanelComponent } from './ha-run-stat-aggregate-panel.component';

describe('HaRunStatAggregatePanelComponent', () => {
  let component: HaRunStatAggregatePanelComponent;
  let fixture: ComponentFixture<HaRunStatAggregatePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaRunStatAggregatePanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaRunStatAggregatePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
