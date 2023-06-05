import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaLabGreenOptionsComponent} from './ca-lab-green-options.component';

describe('CaLabGreenOptionsComponent', () => {
  let component: CaLabGreenOptionsComponent;
  let fixture: ComponentFixture<CaLabGreenOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabGreenOptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabGreenOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
