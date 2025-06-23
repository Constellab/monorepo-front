import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiTagCreateDialogComponent } from './li-tag-create-dialog.component';

describe('LiTagCreateDialogComponent', () => {
  let component: LiTagCreateDialogComponent;
  let fixture: ComponentFixture<LiTagCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiTagCreateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiTagCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
