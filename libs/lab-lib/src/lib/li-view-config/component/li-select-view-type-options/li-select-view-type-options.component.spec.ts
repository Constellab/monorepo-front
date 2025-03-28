import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiSelectViewTypeOptionsComponent } from './li-select-view-type-options.component';

describe('LiSelectViewTypeOptionsComponent', () => {
  let component: LiSelectViewTypeOptionsComponent;
  let fixture: ComponentFixture<LiSelectViewTypeOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectViewTypeOptionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiSelectViewTypeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
