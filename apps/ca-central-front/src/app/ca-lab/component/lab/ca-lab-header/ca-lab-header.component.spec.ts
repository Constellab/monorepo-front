import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabHeaderComponent } from './ca-lab-header.component';

describe('CaLabHeaderComponent', () => {
  let component: CaLabHeaderComponent;
  let fixture: ComponentFixture<CaLabHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaLabHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
