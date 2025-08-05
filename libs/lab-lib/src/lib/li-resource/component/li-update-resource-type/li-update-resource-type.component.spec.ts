import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiUpdateResourceTypeComponent } from './li-update-resource-type.component';

describe('LabUpdateFileTypeComponent', () => {
  let component: LiUpdateResourceTypeComponent;
  let fixture: ComponentFixture<LiUpdateResourceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiUpdateResourceTypeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiUpdateResourceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
