import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiRunningProcessComponent } from './li-running-process.component';

describe('LiRunningProcessComponent', () => {
  let component: LiRunningProcessComponent;
  let fixture: ComponentFixture<LiRunningProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiRunningProcessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiRunningProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
