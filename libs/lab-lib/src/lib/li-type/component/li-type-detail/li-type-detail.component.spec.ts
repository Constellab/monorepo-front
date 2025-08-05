import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiTypeDetailComponent } from './li-type-detail.component';

describe('LiProcessTypeCardComponent', () => {
  let component: LiTypeDetailComponent;
  let fixture: ComponentFixture<LiTypeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiTypeDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
