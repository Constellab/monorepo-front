import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiObjectSyncInfoComponent } from './li-object-sync-info.component';

describe('LiObjectSyncInfoComponent', () => {
  let component: LiObjectSyncInfoComponent;
  let fixture: ComponentFixture<LiObjectSyncInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiObjectSyncInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiObjectSyncInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
