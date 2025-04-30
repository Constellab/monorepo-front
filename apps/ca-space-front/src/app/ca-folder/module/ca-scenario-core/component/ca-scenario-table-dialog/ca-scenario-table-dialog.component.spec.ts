import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaScenarioTableDialogComponent } from './ca-scenario-table-dialog.component';

describe('CaScenariosListDialogComponent', () => {
  let component: CaScenarioTableDialogComponent;
  let fixture: ComponentFixture<CaScenarioTableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaScenarioTableDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaScenarioTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
