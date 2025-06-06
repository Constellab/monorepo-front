import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTagDetailPageComponent } from './lab-tag-detail-page.component';

describe('LabTagDetailPageComponent', () => {
  let component: LabTagDetailPageComponent;
  let fixture: ComponentFixture<LabTagDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabTagDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabTagDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
