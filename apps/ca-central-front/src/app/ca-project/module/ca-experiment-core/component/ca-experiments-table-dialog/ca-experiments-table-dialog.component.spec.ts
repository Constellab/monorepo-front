import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaExperimentsTableDialogComponent} from './ca-experiments-table-dialog.component';

describe('CaExperimentsListDialogComponent', () => {
  let component: CaExperimentsTableDialogComponent;
  let fixture: ComponentFixture<CaExperimentsTableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaExperimentsTableDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaExperimentsTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
