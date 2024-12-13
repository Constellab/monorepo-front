import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlManagerAdvancedComponent } from './lml-manager-advanced.component';

describe('CaLabManagerAdvancedComponent', () => {
  let component: LmlManagerAdvancedComponent;
  let fixture: ComponentFixture<LmlManagerAdvancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlManagerAdvancedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LmlManagerAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
