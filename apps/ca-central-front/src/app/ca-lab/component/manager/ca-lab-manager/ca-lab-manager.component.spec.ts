import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabManagerComponent } from './ca-lab-manager.component';

describe('CaLabManagerComponent', () => {
  let component: CaLabManagerComponent;
  let fixture: ComponentFixture<CaLabManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabManagerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaLabManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
