import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiNavigableImpactDialogComponent } from './li-navigable-impact-dialog.component';

describe('LiNavigableImpactDialogComponent', () => {
  let component: LiNavigableImpactDialogComponent;
  let fixture: ComponentFixture<LiNavigableImpactDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiNavigableImpactDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiNavigableImpactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
