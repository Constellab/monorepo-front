import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaLabGreenOptionValueComponent} from './ca-lab-green-option-value.component';

describe('CaLabGreenOptionValueComponent', () => {
  let component: CaLabGreenOptionValueComponent;
  let fixture: ComponentFixture<CaLabGreenOptionValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabGreenOptionValueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabGreenOptionValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
