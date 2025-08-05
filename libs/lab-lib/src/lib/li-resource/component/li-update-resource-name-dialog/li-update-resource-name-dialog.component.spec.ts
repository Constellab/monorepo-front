import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiUpdateResourceNameDialogComponent } from './li-update-resource-name-dialog.component';

describe('LiUpdateResourceNameDialogComponent', () => {
  let component: LiUpdateResourceNameDialogComponent;
  let fixture: ComponentFixture<LiUpdateResourceNameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiUpdateResourceNameDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiUpdateResourceNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
