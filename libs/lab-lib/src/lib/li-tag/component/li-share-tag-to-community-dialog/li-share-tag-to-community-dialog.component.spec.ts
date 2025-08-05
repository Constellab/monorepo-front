import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiShareTagToCommunityDialogComponent } from './li-share-tag-to-community-dialog.component';

describe('LiShareTagToCommunityDialogComponent', () => {
  let component: LiShareTagToCommunityDialogComponent;
  let fixture: ComponentFixture<LiShareTagToCommunityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiShareTagToCommunityDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LiShareTagToCommunityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
