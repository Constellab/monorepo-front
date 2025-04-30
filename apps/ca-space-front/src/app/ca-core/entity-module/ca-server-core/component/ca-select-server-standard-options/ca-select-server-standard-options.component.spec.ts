import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaSelectServerStandardOptionsComponent } from './ca-select-server-standard-options.component';

describe('CaSelectServerStandardOptionsComponent', () => {
  let component: CaSelectServerStandardOptionsComponent;
  let fixture: ComponentFixture<CaSelectServerStandardOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaSelectServerStandardOptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaSelectServerStandardOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
