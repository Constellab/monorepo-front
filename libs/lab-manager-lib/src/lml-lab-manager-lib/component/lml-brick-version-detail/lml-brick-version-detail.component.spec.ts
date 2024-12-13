import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlBrickVersionDetailComponent } from './lml-brick-version-detail.component';

describe('CaBrickVersionDetailComponent', () => {
  let component: LmlBrickVersionDetailComponent;
  let fixture: ComponentFixture<LmlBrickVersionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlBrickVersionDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LmlBrickVersionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
