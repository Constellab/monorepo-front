import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaLabGreenOptionTableComponent} from './ca-lab-green-option-table.component';

describe('CaLabGreenOptionTableComponent', () => {
  let component: CaLabGreenOptionTableComponent;
  let fixture: ComponentFixture<CaLabGreenOptionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabGreenOptionTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabGreenOptionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
