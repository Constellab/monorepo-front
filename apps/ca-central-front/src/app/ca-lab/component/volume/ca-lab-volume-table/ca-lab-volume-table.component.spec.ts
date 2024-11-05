import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabVolumeTableComponent } from './ca-lab-volume-table.component';

describe('CaLabVolumeTableComponent', () => {
  let component: CaLabVolumeTableComponent;
  let fixture: ComponentFixture<CaLabVolumeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabVolumeTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabVolumeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
