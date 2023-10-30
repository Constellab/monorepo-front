import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HaStoryFileDialogComponent } from './ha-story-file-dialog.component';

describe('HaStoryFileDialogComponent', () => {
  let component: HaStoryFileDialogComponent;
  let fixture: ComponentFixture<HaStoryFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaStoryFileDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaStoryFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
