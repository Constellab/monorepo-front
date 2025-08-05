import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiTagOriginsComponent } from './li-tag-origins.component';

describe('LiTagOriginsComponent', () => {
  let component: LiTagOriginsComponent;
  let fixture: ComponentFixture<LiTagOriginsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiTagOriginsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiTagOriginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
