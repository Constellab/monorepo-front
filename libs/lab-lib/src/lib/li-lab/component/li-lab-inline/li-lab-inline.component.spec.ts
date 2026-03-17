import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiLabInlineComponent } from './li-lab-inline.component';

describe('LiLabInlineComponent', () => {
  let component: LiLabInlineComponent;
  let fixture: ComponentFixture<LiLabInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiLabInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiLabInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
