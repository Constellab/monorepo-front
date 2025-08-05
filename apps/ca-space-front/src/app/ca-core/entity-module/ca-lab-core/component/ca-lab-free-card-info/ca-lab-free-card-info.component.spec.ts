import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabFreeCardInfoComponent } from './ca-lab-free-card-info.component';

describe('CaUserFreeInfoComponent', () => {
  let component: CaLabFreeCardInfoComponent;
  let fixture: ComponentFixture<CaLabFreeCardInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabFreeCardInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabFreeCardInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
