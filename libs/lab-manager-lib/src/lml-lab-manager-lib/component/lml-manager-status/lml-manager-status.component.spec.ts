import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlManagerStatusComponent } from './lml-manager-status.component';

describe('CaLabManagerStatusComponent', () => {
  let component: LmlManagerStatusComponent;
  let fixture: ComponentFixture<LmlManagerStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlManagerStatusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LmlManagerStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
