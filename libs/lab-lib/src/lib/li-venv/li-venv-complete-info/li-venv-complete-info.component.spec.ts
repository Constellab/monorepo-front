import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiVenvCompleteInfoComponent } from './li-venv-complete-info.component';

describe('LiVenvCompleteInfoComponent', () => {
  let component: LiVenvCompleteInfoComponent;
  let fixture: ComponentFixture<LiVenvCompleteInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiVenvCompleteInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiVenvCompleteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
