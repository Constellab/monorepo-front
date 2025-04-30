import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabSupportPageComponent } from './ca-lab-support-page.component';

describe('CaLabSupportPageComponent', () => {
  let component: CaLabSupportPageComponent;
  let fixture: ComponentFixture<CaLabSupportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabSupportPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabSupportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
