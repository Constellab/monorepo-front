import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaSelectGroupComponent } from './ca-select-group.component';

describe('CaSelectGroupComponent', () => {
  let component: CaSelectGroupComponent;
  let fixture: ComponentFixture<CaSelectGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaSelectGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaSelectGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
