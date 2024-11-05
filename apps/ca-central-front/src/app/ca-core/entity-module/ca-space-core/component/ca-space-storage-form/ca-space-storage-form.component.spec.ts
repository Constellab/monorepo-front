import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaSpaceStorageFormComponent } from './ca-space-storage-form.component';

describe('CaSpaceStorageFormComponent', () => {
  let component: CaSpaceStorageFormComponent;
  let fixture: ComponentFixture<CaSpaceStorageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaSpaceStorageFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaSpaceStorageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
