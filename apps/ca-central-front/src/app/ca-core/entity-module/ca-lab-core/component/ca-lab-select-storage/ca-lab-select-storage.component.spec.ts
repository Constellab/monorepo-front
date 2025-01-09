import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabSelectStorageComponent } from './ca-lab-select-storage.component';

describe('CaLabSelectVolumeComponent', () => {
  let component: CaLabSelectStorageComponent;
  let fixture: ComponentFixture<CaLabSelectStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabSelectStorageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabSelectStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
