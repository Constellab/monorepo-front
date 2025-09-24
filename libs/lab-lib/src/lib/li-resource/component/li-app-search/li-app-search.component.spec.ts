import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiAppSearchComponent } from './li-app-search.component';

describe('LiAppSearchComponent', () => {
  let component: LiAppSearchComponent;
  let fixture: ComponentFixture<LiAppSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiAppSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiAppSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
