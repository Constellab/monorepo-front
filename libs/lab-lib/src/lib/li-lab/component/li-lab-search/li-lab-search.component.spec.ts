import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiLabSearchComponent } from './li-lab-search.component';

describe('LiLabSearchComponent', () => {
  let component: LiLabSearchComponent;
  let fixture: ComponentFixture<LiLabSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiLabSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiLabSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
