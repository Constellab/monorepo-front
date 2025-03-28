import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiActivityTableComponent } from './li-activity-table.component';

describe('LiActivityTableComponent', () => {
  let component: LiActivityTableComponent;
  let fixture: ComponentFixture<LiActivityTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiActivityTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiActivityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
