import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaActivityTableComponent} from './ca-activity-table.component';

describe('CaActivityTableComponent', () => {
  let component: CaActivityTableComponent;
  let fixture: ComponentFixture<CaActivityTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaActivityTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaActivityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
