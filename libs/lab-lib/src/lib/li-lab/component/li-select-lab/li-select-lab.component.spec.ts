import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSelectLabComponent } from './li-select-lab.component';

describe('LiSelectLabComponent', () => {
  let component: LiSelectLabComponent;
  let fixture: ComponentFixture<LiSelectLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectLabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSelectLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
