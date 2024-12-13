import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlManagerComponent } from './lml-manager.component';

describe('CaLabManagerComponent', () => {
  let component: LmlManagerComponent;
  let fixture: ComponentFixture<LmlManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlManagerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LmlManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
