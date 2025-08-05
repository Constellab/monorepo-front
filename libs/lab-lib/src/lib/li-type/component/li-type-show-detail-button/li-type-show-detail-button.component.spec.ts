import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiTypeShowDetailButtonComponent } from './li-type-show-detail-button.component';

describe('LabProcessTypeShowDetailButtonComponent', () => {
  let component: LiTypeShowDetailButtonComponent;
  let fixture: ComponentFixture<LiTypeShowDetailButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiTypeShowDetailButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiTypeShowDetailButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
