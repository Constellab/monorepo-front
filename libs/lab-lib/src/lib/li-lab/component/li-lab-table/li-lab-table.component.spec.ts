import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiLabTableComponent } from './li-lab-table.component';

describe('LiLabTableComponent', () => {
  let component: LiLabTableComponent;
  let fixture: ComponentFixture<LiLabTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiLabTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiLabTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
