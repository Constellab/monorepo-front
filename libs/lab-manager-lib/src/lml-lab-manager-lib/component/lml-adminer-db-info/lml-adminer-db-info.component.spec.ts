import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlAdminerDbInfoComponent } from './lml-adminer-db-info.component';

describe('LmlAdminerDbInfoComponent', () => {
  let component: LmlAdminerDbInfoComponent;
  let fixture: ComponentFixture<LmlAdminerDbInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlAdminerDbInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LmlAdminerDbInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
