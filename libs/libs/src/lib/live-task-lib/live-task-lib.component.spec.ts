import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveTaskLibComponent } from './live-task-lib.component';

describe('LiveTaskLibComponent', () => {
  let component: LiveTaskLibComponent;
  let fixture: ComponentFixture<LiveTaskLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveTaskLibComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveTaskLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
