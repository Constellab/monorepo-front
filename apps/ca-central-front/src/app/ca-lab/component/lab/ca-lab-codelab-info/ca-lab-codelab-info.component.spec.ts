import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabCodelabInfoComponent } from './ca-lab-codelab-info.component';

describe('CaLabCodelabInfoComponent', () => {
  let component: CaLabCodelabInfoComponent;
  let fixture: ComponentFixture<CaLabCodelabInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaLabCodelabInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabCodelabInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
