import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiTagValueFormatOptionsComponent } from './li-tag-value-format-options.component';

describe('LiTagValueFormatOptionsComponent', () => {
  let component: LiTagValueFormatOptionsComponent;
  let fixture: ComponentFixture<LiTagValueFormatOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiTagValueFormatOptionsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LiTagValueFormatOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
