import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaLabManagerConfigComponent} from './ca-lab-manager-config.component';

describe('CaLabConfigComponent', () => {
  let component: CaLabManagerConfigComponent;
  let fixture: ComponentFixture<CaLabManagerConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaLabManagerConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaLabManagerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
