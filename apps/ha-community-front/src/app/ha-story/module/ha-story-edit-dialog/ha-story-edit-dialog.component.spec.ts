import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaStoryEditDialogComponent } from './ha-story-edit-dialog.component';

describe('HaStoryEditDialogComponent', () => {
  let component: HaStoryEditDialogComponent;
  let fixture: ComponentFixture<HaStoryEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaStoryEditDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaStoryEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
