import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabSearchComponent } from './ca-lab-search.component';

describe('CaLabSearchComponent', () => {
  let component: CaLabSearchComponent;
  let fixture: ComponentFixture<CaLabSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
