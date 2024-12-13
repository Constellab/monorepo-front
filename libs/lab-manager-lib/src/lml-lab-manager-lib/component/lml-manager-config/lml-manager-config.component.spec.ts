import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlManagerConfigComponent } from './lml-manager-config.component';

describe('CaLabConfigComponent', () => {
  let component: LmlManagerConfigComponent;
  let fixture: ComponentFixture<LmlManagerConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlManagerConfigComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LmlManagerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
