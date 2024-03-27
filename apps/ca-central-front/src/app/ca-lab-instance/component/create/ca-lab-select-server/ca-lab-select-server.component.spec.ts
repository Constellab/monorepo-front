import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaLabSelectServerComponent} from './ca-lab-select-server.component';

describe('CaLabSelectServerComponent', () => {
  let component: CaLabSelectServerComponent;
  let fixture: ComponentFixture<CaLabSelectServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabSelectServerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabSelectServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
