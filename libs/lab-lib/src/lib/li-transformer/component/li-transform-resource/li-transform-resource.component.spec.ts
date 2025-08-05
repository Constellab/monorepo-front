import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiTransformResourceComponent } from './li-transform-resource.component';

describe('LiTransformResourceComponent', () => {
  let component: LiTransformResourceComponent;
  let fixture: ComponentFixture<LiTransformResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiTransformResourceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiTransformResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
