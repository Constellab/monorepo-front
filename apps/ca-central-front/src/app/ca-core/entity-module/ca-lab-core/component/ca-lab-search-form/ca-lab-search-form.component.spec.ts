import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaLabSearchFormComponent} from './ca-lab-search-form.component';

describe('CaLabSearchFormComponent', () => {
  let component: CaLabSearchFormComponent;
  let fixture: ComponentFixture<CaLabSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaLabSearchFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
