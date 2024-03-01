import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LtLiveTaskCreateDialogFormComponent } from './lt-live-task-create-dialog-form.component';

describe('LtLiveTaskCreateDialogComponent', () => {
  let component: LtLiveTaskCreateDialogFormComponent;
  let fixture: ComponentFixture<LtLiveTaskCreateDialogFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LtLiveTaskCreateDialogFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LtLiveTaskCreateDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
