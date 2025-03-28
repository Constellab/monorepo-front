import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiBricksSelectOptionsComponent } from './li-bricks-select-options.component';

describe('LiBricksSelectOptionsComponent', () => {
  let component: LiBricksSelectOptionsComponent;
  let fixture: ComponentFixture<LiBricksSelectOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiBricksSelectOptionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiBricksSelectOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
