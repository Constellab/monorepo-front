import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoTagValueEditDialogComponent } from './co-tag-value-edit-dialog.component';

describe('CoTagValueEditDialogComponent', () => {
  let component: CoTagValueEditDialogComponent;
  let fixture: ComponentFixture<CoTagValueEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoTagValueEditDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CoTagValueEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
