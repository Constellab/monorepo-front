import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabManagerAdvancedComponent } from './ca-lab-manager-advanced.component';

describe('CaLabManagerAdvancedComponent', () => {
  let component: CaLabManagerAdvancedComponent;
  let fixture: ComponentFixture<CaLabManagerAdvancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabManagerAdvancedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabManagerAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
