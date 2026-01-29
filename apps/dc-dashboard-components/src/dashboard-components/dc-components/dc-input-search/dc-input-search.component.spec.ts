import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcInputSearchComponent } from './dc-input-search.component';

describe('DcInputSearchComponent', () => {
  let component: DcInputSearchComponent;
  let fixture: ComponentFixture<DcInputSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DcInputSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DcInputSearchComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
