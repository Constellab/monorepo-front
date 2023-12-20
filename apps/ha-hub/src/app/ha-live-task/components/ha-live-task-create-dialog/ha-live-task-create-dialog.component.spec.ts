import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HaLiveTaskCreateDialogComponent } from './ha-live-task-create-dialog.component';

describe('HaLiveTaskCreateDialogComponent', () => {
  let component: HaLiveTaskCreateDialogComponent;
  let fixture: ComponentFixture<HaLiveTaskCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaLiveTaskCreateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaLiveTaskCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
