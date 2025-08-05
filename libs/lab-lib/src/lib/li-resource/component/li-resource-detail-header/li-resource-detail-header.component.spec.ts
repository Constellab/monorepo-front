import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiResourceDetailHeaderComponent } from './li-resource-detail-header.component';

describe('LiResourceDetailHeaderComponent', () => {
  let component: LiResourceDetailHeaderComponent;
  let fixture: ComponentFixture<LiResourceDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceDetailHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiResourceDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
