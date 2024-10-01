import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabConfigPageComponent } from './ca-lab-config-page.component';

describe('CaLabConfigPageComponent', () => {
  let component: CaLabConfigPageComponent;
  let fixture: ComponentFixture<CaLabConfigPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaLabConfigPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabConfigPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
