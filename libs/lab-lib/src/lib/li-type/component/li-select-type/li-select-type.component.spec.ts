import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiSelectTypeComponent } from './li-select-type.component';

describe('LiSelectTypeComponent', () => {
  let component: LiSelectTypeComponent;
  let fixture: ComponentFixture<LiSelectTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSelectTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
