import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiTagDetailComponent } from './li-tag-detail.component';

describe('LiTagDetailComponent', () => {
  let component: LiTagDetailComponent;
  let fixture: ComponentFixture<LiTagDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiTagDetailComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LiTagDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
