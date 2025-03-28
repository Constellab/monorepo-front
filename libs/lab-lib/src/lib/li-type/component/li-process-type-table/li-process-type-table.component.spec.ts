import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiProcessTypeTableComponent } from './li-process-type-table.component';

describe('LiProcessTypeTableComponent', () => {
  let component: LiProcessTypeTableComponent;
  let fixture: ComponentFixture<LiProcessTypeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiProcessTypeTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiProcessTypeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
