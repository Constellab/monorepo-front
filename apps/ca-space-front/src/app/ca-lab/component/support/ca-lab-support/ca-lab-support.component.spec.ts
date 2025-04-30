import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabSupportComponent } from './ca-lab-support.component';

describe('CaLabSupportComponent', () => {
  let component: CaLabSupportComponent;
  let fixture: ComponentFixture<CaLabSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabSupportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
