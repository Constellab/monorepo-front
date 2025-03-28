import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiProgressMessageComponent } from './li-progress-message.component';

describe('LiProgressMessageComponent', () => {
  let component: LiProgressMessageComponent;
  let fixture: ComponentFixture<LiProgressMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiProgressMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiProgressMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
