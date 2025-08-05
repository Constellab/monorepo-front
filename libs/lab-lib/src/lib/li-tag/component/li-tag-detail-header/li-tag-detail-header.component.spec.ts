import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiTagDetailHeaderComponent } from './li-tag-detail-header.component';

describe('LiTagDetailHeaderComponent', () => {
  let component: LiTagDetailHeaderComponent;
  let fixture: ComponentFixture<LiTagDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiTagDetailHeaderComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LiTagDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
