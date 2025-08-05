import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiShareLinkFormDialogComponent } from './li-share-link-form-dialog.component';

describe('LiShareLinkFormDialogComponent', () => {
  let component: LiShareLinkFormDialogComponent;
  let fixture: ComponentFixture<LiShareLinkFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiShareLinkFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiShareLinkFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
