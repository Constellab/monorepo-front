import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoLiveTaskCreateDialogFormComponent } from './co-live-task-create-dialog-form.component';

describe('CoLiveTaskCreateDialogComponent', () => {
  let component: CoLiveTaskCreateDialogFormComponent;
  let fixture: ComponentFixture<CoLiveTaskCreateDialogFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoLiveTaskCreateDialogFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoLiveTaskCreateDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
