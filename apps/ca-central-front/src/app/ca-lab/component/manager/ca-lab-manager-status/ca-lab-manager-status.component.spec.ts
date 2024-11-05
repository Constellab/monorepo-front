import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabManagerStatusComponent } from './ca-lab-manager-status.component';

describe('CaLabManagerStatusComponent', () => {
  let component: CaLabManagerStatusComponent;
  let fixture: ComponentFixture<CaLabManagerStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabManagerStatusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaLabManagerStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
