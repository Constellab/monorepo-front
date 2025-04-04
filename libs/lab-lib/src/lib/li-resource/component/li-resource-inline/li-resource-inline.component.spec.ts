import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiResourceInlineComponent } from './li-resource-inline.component';

describe('LiResourceInlineComponent', () => {
  let component: LiResourceInlineComponent;
  let fixture: ComponentFixture<LiResourceInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiResourceInlineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiResourceInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
